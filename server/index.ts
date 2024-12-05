import { ApolloServer, gql } from "apollo-server";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import jwt from "jsonwebtoken";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      return { userId };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server corriendo :v ${url}`);
});

export default server;
