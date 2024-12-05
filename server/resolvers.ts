import { PubSub } from "graphql-subscriptions";
import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import jwt from "jsonwebtoken";

const pubsub = new PubSub();
const prisma = new pc.PrismaClient();

// Topics para suscripciones
const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) throw new ForbiddenError("No autorizado");
      return await prisma.user.findMany({
        where: { id: { not: userId } },
        orderBy: { createdAt: "desc" },
      });
    },
    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new ForbiddenError("No autorizado");
      return await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
    },
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: userNew.email },
      });
      if (existingUser) throw new AuthenticationError("El email ya está registrado");

      const hashedPassword = await bcrypt.hash(userNew.password, 10);
      const newUser = await prisma.user.create({
        data: { ...userNew, password: hashedPassword },
      });
      return newUser;
    },
    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({
        where: { email: userSignin.email },
      });
      if (!user) throw new AuthenticationError("Usuario no encontrado");

      const isPasswordValid = await bcrypt.compare(userSignin.password, user.password);
      if (!isPasswordValid) throw new AuthenticationError("Credenciales incorrectas");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      return { token };
    },
    createMessage: async (_, { receiverId, text }, { userId }) => {
      if (!userId) throw new ForbiddenError("No autorizado");

      const message = await prisma.message.create({
        data: {
          text,
          receiverId,
          senderId: userId,
        },
      });

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, __, { userId }) => {
        if (!userId) throw new ForbiddenError("No autorizado");
        return pubsub.asyncIterator(MESSAGE_ADDED);
      },
    },
  },
};

export default resolvers;
