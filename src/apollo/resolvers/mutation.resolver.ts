import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-micro";
import * as bcrypt from "bcryptjs";
import * as cookies from "cookie";
import { randomBytes } from "crypto";
import * as jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { promisify } from "util";
import {
  ENABLE_INVITE_CODE,
  PASSWORD_REGEX,
  SESSION_SECRET,
} from "../../config";
import { MutationResolvers, Point } from "../../server/types";
import Mapbox from "@mapbox/mapbox-sdk/services/geocoding";

export const resolvers: MutationResolvers = {
  async registerUser(_, { input }, ctx) {
    const { inviteCode, ...inputWOInvite } = input;
    let hasValidInvitation: boolean;
    // 0. check if there is an invite code
    if (ENABLE_INVITE_CODE) {
      if (!inviteCode) throw new ForbiddenError("invite code required");
      // check if the invite code if valid
      const invite = await ctx.db.invitations.findOne({
        email: input.email,
        code: inviteCode,
      });

      if (!invite) throw new ForbiddenError("invalid invite code");
      if (invite.usedAt) throw new ForbiddenError("invition already used");
      hasValidInvitation = true;
    } else {
      hasValidInvitation = false;
    }
    // 1. check if the user already exists
    let user = await ctx.db.users.findOne({ email: input.email });
    if (user) throw new UserInputError("EMAIL_TAKEN");
    user = await ctx.db.users.findOne({ username: input.username });
    if (user) throw new UserInputError("USERNAME_TAKEN");

    // 2. check password complexity
    if (!PASSWORD_REGEX.test(input.password)) {
      throw new UserInputError("PASSWORD_WEAK");
    }

    // 3. generate password hash
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // 4. create user in database
    const record = await ctx.db.users.insertOne({
      ...inputWOInvite,
      password: hashedPassword,
      createdAt: new Date(),
    });

    user = await ctx.db.users.findOne({ _id: record.insertedId });

    // 4.1 update invite code if any
    hasValidInvitation &&
      (await this.invitationRepository.findOneAndUpdate(
        { code: inviteCode },
        { usedAt: new Date() }
      ));

    // 5. generate a jsonwebtoken from the user id
    const sessionToken = jwt.sign(
      { userID: user._id.toHexString() },
      SESSION_SECRET
    );

    ctx.response.setHeader(
      "Set-Cookie",
      cookies.serialize("session", sessionToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
      })
    );

    // 6. return the user
    return user;
  },

  async login(_, { email, password }, ctx) {
    // 1. check if a user with the email exist
    const user = await ctx.db.users.findOne({ email });
    if (!user) throw new UserInputError("INVALID_CREDENTIALS");

    // 2. verify if the password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UserInputError("INVALID_CREDENTIALS");

    // 3. craft the session token
    const sessionToken = jwt.sign(
      { userID: user._id.toHexString() },
      SESSION_SECRET
    );

    ctx.response.setHeader(
      "Set-Cookie",
      cookies.serialize("session", sessionToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        path: "/",
      })
    );

    // 4. return the user
    return user;
  },

  logout(_, __, ctx) {
    ctx.response.setHeader(
      "Set-Cookie",
      cookies.serialize("session", "", {
        httpOnly: true,
        maxAge: -1,
        path: "/",
      })
    );
    return true;
  },

  async requestPasswordReset(_, { email }, ctx) {
    // 1. check if the email is bound to an existing account.
    const user = await ctx.db.users.findOne({ email });
    if (!user) return false;

    // 2. craft a token
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    // 3. set the token info
    await ctx.db.users.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry } }
    );

    // 4. send the reset email
    try {
      // FIXME: implement the mailer
      // await ctx.mailer.sendPasswordResetEmail({
      //   to: user.email,
      //   token: resetToken,
      // });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  },

  async resetPassword(_, { input }, ctx) {
    // 1. check if the password and the confirmation are the same
    const { token, password, passwordConfirmation } = input;
    if (password !== passwordConfirmation) {
      throw new UserInputError("Password do not match");
    }
    // 2. look for the user
    const user = await ctx.db.users.findOne({
      resetToken: token,
      resetTokenExpiry: { $gte: Date.now() - 3600000 },
    });

    if (!user) throw new UserInputError("Invalid or expired token");

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. update the user
    const updatedUser = await ctx.db.users.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      }
    );

    // 5. log the user in and return it
    const sessionToken = jwt.sign(
      { userID: user._id.toHexString() },
      SESSION_SECRET
    );
    ctx.response.setHeader(
      "Set-Cookie",
      cookies.serialize("session", sessionToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        path: "/",
      })
    );

    return ctx.db.users.findOne({ _id: updatedUser.upsertedId._id });
  },

  async createRide(_, { input }, ctx) {
    // 1. get the current user
    if (!ctx.userID) throw new AuthenticationError("LOGIN_REQUIRED");
    const user = await ctx.db.users.findOne({
      _id: new ObjectID(ctx.userID),
    });

    if (!user) throw new AuthenticationError("LOGIN_REQUIRED");
    if (input.points.length <= 2) {
      throw new UserInputError("RIDE_TOO_SHORT");
    }
    if (!input.name) {
      throw new UserInputError("RIDE_NAME_REQUIRED");
    }

    // reverse geocode start point end endpoint
    const geocoder = Mapbox({ accessToken: process.env.MAPBOX_TOKEN });
    const startPoint = [...input.points].reverse().pop();
    const startResponse = await geocoder
      .reverseGeocode({
        query: [startPoint.longitude, startPoint.latitude],
        mode: "mapbox.places",
        types: ["place", "locality"],
        language: ["fr"],
      })
      .send();
    const finishPoint = [...input.points].pop();
    const endResponse = await geocoder
      .reverseGeocode({
        query: [finishPoint.longitude, finishPoint.latitude],
        mode: "mapbox.places",
        types: ["place", "locality"],
        language: ["fr"],
      })
      .send();

    const start = startResponse?.body?.features?.[0]?.text || "";
    const finish = endResponse?.body?.features?.[0]?.text || "";

    // 3. store ride in database
    const record = await ctx.db.rides.insertOne({
      ...input,
      points: input.points as Point[],
      creatorID: user._id,
      createdAt: new Date(),
      start,
      finish,
    });

    return ctx.db.rides.findOne({ _id: record.insertedId });
  },

  async deleteRide(_, { id }, ctx) {
    const rideID = new ObjectID(id);
    const ride = await ctx.db.rides.findOne({
      _id: rideID,
    });

    if (!ride) throw new UserInputError("no matching ride");
    if (!(ride.creatorID.toString() === ctx.userID))
      throw new ForbiddenError("NOT_ALLOWED");

    await ctx.db.rides.deleteOne({ _id: rideID });
    return ride;
  },
};
