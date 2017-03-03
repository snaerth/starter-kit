import mongoose, {Schema} from 'mongoose';

const schema = {
    title: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
};

// Define user model
const newsSchema = new Schema(schema);

export default mongoose.model('news', newsSchema);