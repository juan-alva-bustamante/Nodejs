import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { JobApplicationsSchema } from "./JobApplicationsSchema";

export interface IJobApplications extends Document {
  _id: string;
  status: string;
  owners: any[];
  userId: any;
}

export const JobApplicationsModel = mongoose.model<IJobApplications>(
  "jobapplications",
  JobApplicationsSchema
);
