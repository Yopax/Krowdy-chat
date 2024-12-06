import { GraphQLScalarType, Kind } from "graphql";
import { PubSub } from "graphql-subscriptions";
import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import jwt from "jsonwebtoken";

const pubsub = new PubSub();
const prisma = new pc.PrismaClient();

const MESSAGE_ADDED = "MESSAGE_ADDED";


const resolvers = {

  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) throw new ForbiddenError("No autorizado");
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        where: { id: { not: userId } },
      });
      return users;
    },
    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new ForbiddenError("No autorizado");
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
      return messages;
    },
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await prisma.user.findUnique({
        where: { email: userNew.email },
      });
      if (user) throw new AuthenticationError("Usuario ya existe");
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

      const isPasswordValid = await bcrypt.compare(
        userSignin.password,
        user.password
      );
      if (!isPasswordValid)
        throw new AuthenticationError("Credenciales incorrectas");

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
      subscribe: () => pubsub.asyncIterableIterator(MESSAGE_ADDED),
    },
  },
};

export default resolvers;