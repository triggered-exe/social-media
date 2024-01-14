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
    post : {
        type: mongoose.ObjectId,
        ref: 'Post',
        required: true,
    },
    likes: [
        {
            type: mongoose.ObjectId,
            ref: "Users",
        },
    ],
    likesCount : {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const postModel = mongoose.model('Comments', postSchema);

export default postModel;
