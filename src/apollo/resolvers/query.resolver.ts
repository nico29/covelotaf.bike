import { QueryResolvers, RideEntity } from "../../server/types";
import { ObjectID } from "mongodb";
import { AuthenticationError } from "apollo-server-micro";

export const resolvers: QueryResolvers = {
  currentUser(_, __, context) {
    return context.userID
      ? context.db.users.findOne({ _id: new ObjectID(context.userID) })
      : null;
  },

  ride(_, { id }, ctx) {
    if (!ctx.userID) throw new AuthenticationError("LOGIN_REQUIRED");
    return ctx.db.rides.findOne({ _id: new ObjectID(id) });
  },

  rides(_, __, ctx) {
    return ctx.db.rides.find().sort({ _id: -1 }).toArray();
  },
};
