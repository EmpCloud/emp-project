import mongoose from 'mongoose';

const failedDataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('FailedData', failedDataSchema);
