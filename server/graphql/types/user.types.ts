import gql from "graphql-tag";

export default gql`
  type User
    @entity(
      additionalFields: [
        { path: "password", type: "string" }
        { path: "resetToken?", type: "string" }
        { path: "resetTokenExpiry?", type: "number" }
        { path: "createdAt", type: "Date" }
      ]
    ) {
    id: ID! @id
    email: String! @column
    firstname: String @column
    lastname: String @column
    username: String! @column
    rides: [Ride!] @column
  }

  type Invitation
    @entity(
      additionalFields: [
        { path: "_id", type: "ObjectID" }
        { path: "email", type: "string" }
        { path: "code", type: "string" }
        { path: "createdAt", type: "Date" }
        { path: "usedAt?", type: "Date" }
      ]
    ) {
    id: ID!
  }

  input RegisterUserInput {
    email: String!
    password: String!
    firstname: String
    lastname: String
    username: String!
    inviteCode: String
  }

  input ResetPasswordInput {
    token: String!
    password: String!
    passwordConfirmation: String!
  }
`;
