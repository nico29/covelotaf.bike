import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import { ApolloServer } from "apollo-server-micro";
import { GraphQLContext } from "../../server/context";
import DatabaseManager from "../../server/database";
import { resolvers as MutationResolvers } from "../../server/graphql/resolvers/mutation.resolver";
import { resolvers as QueryResolvers } from "../../server/graphql/resolvers/query.resolver";
import types from "../../server/graphql/types/index.types";
import { resolvers as UserResolvers } from "../../server/graphql/resolvers/user.resolver";
import { resolvers as RideResolvers } from "../../server/graphql/resolvers/ride.resolver";

(async function () {
  await DatabaseManager.connect();
})();

const apolloServer = new ApolloServer({
  typeDefs: [DIRECTIVES, types],
  resolvers: {
    Query: QueryResolvers,
    Mutation: MutationResolvers,
    User: UserResolvers,
    Ride: RideResolvers,
  },
  context: ({ req, res }) => new GraphQLContext(req, res),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
