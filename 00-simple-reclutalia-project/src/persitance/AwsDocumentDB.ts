import { Connection } from "mongoose";

const mongoose = require("mongoose");

export class AwsDocumentDB {
  private database!: Connection;

  constructor() {
    try {
      this.connection();
    } catch (error) {
      console.log("Error connection:\n", error);
    }
  }

  private connection() {
    if (mongoose.connection.readyState === 0) {
      const url = process.env.urlMongo;
      try {
        mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("successful");
      } catch (error) {
        console.log(error);
      }
    }
  }

  public closeConnection() {
    console.log("close connection ...");
    if (!this.database) {
      return;
    }
    mongoose.disconnect();
  }

  public validateConnection() {
    console.log("check connection ...");

    this.database = mongoose.connection;
    // When mentioned database is available and successfully connects
    this.database.once("open", async () => {
      console.log("Connected to database successfully");
    });

    // In case of any error
    this.database.on("error", () => {
      console.log(`Error connecting to database. `);
    });
  }
}
