import { ApolloServer } from "apollo-server-express";
import express from "express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import jwt from "jsonwebtoken";

const app = express();

// Contexto para HTTP
const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    return { userId };
  }
};

// Esquema de GraphQL
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema, context });

await apolloServer.start();
apolloServer.applyMiddleware({ app, path: "/graphql" });

// Configuración del servidor HTTP y WebSocket
const server = app.listen(4000, () => {
  const wsServer = new WebSocketServer({
    server,
    path: "/graphql",
  });

  // Configuración de `useServer` con contexto
  useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        const token = ctx.connectionParams?.authorization;
        if (token) {
          try {
            const { userId } = jwt.verify(token, process.env.JWT_SECRET);
            return { userId };
          } catch (error) {
            console.error("Token inválido:", error);
          }
        }
        return {};
      },
    },
    wsServer
  );

  console.log("Server running on port 4000");
});
