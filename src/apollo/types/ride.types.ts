import gql from "graphql-tag";
export default gql`
  type Ride
    @entity(
      additionalFields: [
        { path: "creatorID", type: "ObjectID" }
        { path: "createdAt", type: "Date" }
      ]
    ) {
    id: ID! @id
    creator: User!
    name: String! @column
    description: String @column
    points: [Point!]! @column
    distance: Float! @column
    start: String! @column
    finish: String! @column
    previewURL: String!
    color: String!
  }

  type Point {
    latitude: Float!
    longitude: Float!
  }

  input PointInput {
    latitude: Float!
    longitude: Float!
  }

  input CreateRideInput {
    name: String!
    points: [PointInput!]!
    description: String
    distance: Float!
  }

  input ContactRideCreatorInput {
    userID: ID!
    mailObject: String!
    mailContent: String!
  }
`;
