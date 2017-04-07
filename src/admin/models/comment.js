import mongoose, { Schema } from 'mongoose';

const schema = {
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        default: Schema.ObjectId
    },
    comment: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
};

// Define user model
const commentSchema = new Schema(schema);

export default mongoose.model('comment', commentSchema);