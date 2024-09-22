import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    method: String,
    url: String,
    ip: String,
    date: { type: Date, default: Date.now },
    responseTime: Number,
});

const logDetails = mongoose.model('Log', logSchema);

export default logDetails;
