import * as dotenv from "dotenv";
import express = require("express");
import morgan = require("morgan");
import bodyParser = require("body-parser");
import { Request, Response } from "express";

import { CodeCommitController } from "./controllers/CodeCommitController";
import { CopyToS3 } from "./controllers/CopyToS3";
import { SurveysFirebaseController } from "./controllers/SurveysFirebase";
import { InfraSystem } from "./controllers/InfraSystem";

const cors = require("cors");
dotenv.config();

class App {
  public express: any;
  // public connection: AwsDocumentDB;
  private codeCommitController: CodeCommitController;
  private copyToS3: CopyToS3;
  private surveysFirebaseController: SurveysFirebaseController;
  private infraSystem: InfraSystem;

  constructor() {
    // this.connection = new AwsDocumentDB();
    this.codeCommitController = new CodeCommitController();
    this.copyToS3 = new CopyToS3();
    this.surveysFirebaseController = new SurveysFirebaseController();
    this.infraSystem = new InfraSystem();
    this.express = express();
    this.express.use(morgan("dev"));
    this.express.use(cors({ origin: true }));
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(port?: number): void {
    this.express.use(bodyParser.json({ limit: "100mb" }));
    this.express.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  }

  private initializeRoutes(): void {
    const router = express.Router();
    router.get("/test", this.executeQuery);
    router.use("/aws", this.codeCommitController.router);
    router.use("/aws-upload", this.copyToS3.router);
    router.use("/firebase", this.surveysFirebaseController.router);
    router.use("/infra", this.infraSystem.router);
    this.express.use("/", router);
  }

  private async executeQuery(request: Request, response: Response) {
    try {
      return response.status(200).json({
        status: 200,
        success: "true",
        message: "SQS",
        data: [],
      });
    } catch (err) {
      return response.status(200).json({
        status: 400,
        success: "false",
        message: "Error",
        data: err,
      });
    }
  }
}

export default new App().express;
