import { MongoClient } from "mongodb";

export default class DatabaseManager {
  static client?: MongoClient;

  static async connect() {
    if (!DatabaseManager.client || !DatabaseManager.client.isConnected) {
      DatabaseManager.client = await MongoClient.connect(
        "mongodb://localhost:27017/covelotaf",
        {
          useUnifiedTopology: true,
        }
      );
    }
  }
}
