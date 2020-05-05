import { resolvers as MutationResolvers } from "./mutation.resolver";
import { resolvers as QueryResolvers } from "./query.resolver";
import { resolvers as UserResolvers } from "./user.resolver";
import { resolvers as RideResolvers } from "./ride.resolver";

export default {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
  User: UserResolvers,
  Ride: RideResolvers,
};
