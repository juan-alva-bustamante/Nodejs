import { Schema } from "mongoose";

export const JobApplicationsSchema = new Schema({
  // _id: { type: String },
  status: { type: String },
  owners: { type: Array },
  userId: { type: Object },
});
