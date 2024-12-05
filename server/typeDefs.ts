import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type Message {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date!
  }

  type Token {
    token: String!
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }

  type Query {
    users: [User]
    messagesByUser(receiverId: Int!): [Message]
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createMessage(receiverId: Int!, text: String!): Message
  }

  type Subscription {
    messageAdded: Message
  }
`;

export default typeDefs;
