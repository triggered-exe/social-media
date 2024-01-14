import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.ObjectId,
        ref: 'Users',
        required: true
    },
    media: {
        public_id: String,
        url: String
    },
    likes: [
        {
            type: mongoose.ObjectId,
            ref: "Users",
        },
    ],
    likesCount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const postModel = mongoose.model('Posts', postSchema);

export default postModel;
