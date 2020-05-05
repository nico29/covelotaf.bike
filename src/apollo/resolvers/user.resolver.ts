import { UserResolvers, User, UserEntity } from "../../server/types";

export const resolvers: UserResolvers = {
  id(user) {
    return user._id.toHexString();
  },

  rides(user, _, ctx) {
    return ctx.db.rides.find({ creatorID: user._id }).toArray();
  },
};
