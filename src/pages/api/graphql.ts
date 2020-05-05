import { ApolloServer } from "apollo-server-micro";
import { GraphQLContext } from "../../server/context";
import DatabaseManager from "../../server/database";
import { schema } from "../../apollo/schema";

(async function () {
  await DatabaseManager.connect();
})();

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => new GraphQLContext(req, res),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
