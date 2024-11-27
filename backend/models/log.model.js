import mongoose from 'mongoose';

const requestLogSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  responseTime: Number,
  user: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: String,
});

const RequestLog = mongoose.model('RequestLog', requestLogSchema);

export default RequestLog;