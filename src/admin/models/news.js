import mongoose, {Schema} from 'mongoose';
import Comment from './comment';

const schema = {
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
        default: Schema.ObjectId
    },
    title: {
        type: String,
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
    },
    comments: {
        type: Comment,
        required: false
    }
};

// Define user model
const newsSchema = new Schema(schema);

export default mongoose.model('news', newsSchema);