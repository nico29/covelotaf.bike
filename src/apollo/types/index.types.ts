import gql from "graphql-tag";
import UserTypes from "./user.types";
import RideTypes from "./ride.types";

export default gql`
  ${UserTypes}
  ${RideTypes}

  type Query {
    ride(id: ID!): Ride
    rides: [Ride!]!
    currentUser: User
  }

  type Mutation {
    createRide(input: CreateRideInput!): Ride!
    deleteRide(id: ID!): Ride!
    registerUser(input: RegisterUserInput!): User!
    login(email: String!, password: String!): User!
    logout: Boolean!
    resetPassword(input: ResetPasswordInput!): User!
    contactRideCreator(input: ContactRideCreatorInput!): Boolean!
    requestPasswordReset(email: String!): Boolean!
  }
`;
