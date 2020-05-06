import { Collection } from "mongodb";
import * as jwt from "jsonwebtoken";

import { NextApiRequest, NextApiResponse } from "next";
import DatabaseManager from "./database";
import { UserEntity, RideEntity, InvitationEntity } from "./types";
import { SESSION_SECRET } from "../config";
type Database = {
  users: Collection<UserEntity>;
  rides: Collection<RideEntity>;
  invitations: Collection<InvitationEntity>;
};
export interface Context {
  userID?: string;
  db: Database;
  request: NextApiRequest;
  response: NextApiResponse;
}
export class GraphQLContext implements Context {
  constructor(
    public request: NextApiRequest,
    public response: NextApiResponse
  ) {
    console.log("building context");
    const session = request.cookies.session;
    if (session) {
      try {
        const { userID } = jwt.verify(session, SESSION_SECRET) as {
          userID: string;
        };
        this.userID = userID;
      } catch {}
    }
    const db = DatabaseManager.client.db("covelotaf");
    this.db = {
      users: db.collection("users"),
      rides: db.collection("rides"),
      invitations: db.collection("invitations"),
    };
  }
  userID?: string;
  db: Database;
}
