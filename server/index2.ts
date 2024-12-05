import { ApolloServer } from "apollo-server-express";
import express from "express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import http from "http";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import jwt from "jsonwebtoken";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const context = ({ req }: any) => {
  const token = req.headers.authorization || "";
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!);
    return { userId };
  } catch {
    return {};
  }
};

const apolloServer = new ApolloServer({ schema, context });
await apolloServer.start();
apolloServer.applyMiddleware({ app, path: "/graphql" });
const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
useServer(
  {
    schema,
    context: async (ctx) => {
      const token = ctx.connectionParams?.Authorization || null;
      if (token) {
        try {
          const { userId } = jwt.verify(token, process.env.JWT_SECRET!);
          return { userId };
        } catch {
          throw new Error("Token inválido en suscripciones");
        }
      }
      return {};
    },
  },
  wsServer
);

httpServer.listen(4000, () => {
  console.log("🚀 Servidor HTTP en http://localhost:4000/graphql");
  console.log("🚀 Suscripciones WS en ws://localhost:4000/graphql");
});
