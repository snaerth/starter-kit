import mongoose, {
  Schema
} from 'mongoose';

const schema = {
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
};

// Define user model
const imageSchema = new Schema(schema);

export default mongoose.model('image', imageSchema);