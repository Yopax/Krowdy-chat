import { gql } from "apollo-server-express";

const typeDefs = gql`

  type Query {
    users: [User]
    messagesByUser(receiverId: Int!): [Message]
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

  type Token {
    token: String!
  }

  type Message {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date!
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createMessage(receiverId: Int!, text: String!): Message
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Subscription {
    messageAdded: Message
  }

  scalar Date
`;

export default typeDefs;
