import { ApolloServer } from "apollo-server-micro";
import { GraphQLContext } from "../../server/context";
import DatabaseManager from "../../server/database";
import { schema } from "../../apollo/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    await DatabaseManager.connect();
    return new GraphQLContext(req, res);
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
