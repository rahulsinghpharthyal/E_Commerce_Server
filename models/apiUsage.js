import mongoose from "mongoose";

const apiUsageSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  ipAddress: String,

}, {timestamps: true});

const ApiUsage = mongoose.model('ApiUsage', apiUsageSchema);

export default ApiUsage;