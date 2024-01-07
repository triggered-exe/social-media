import cloudinary from '../utils/cloudinaryConfig.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import fs from 'fs';
import customError from '../utils/customErrors.js';

// functoon to get all the post
export const getPost = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Convert page and limit to integers
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
    
        // Calculate skip based on the current page and limit
        const skip = (parsedPage - 1) * parsedLimit;

        const posts = await Post
        .find()
        .sort({ createdAt: -1 }) // Sorting by creation date in descending order
        .skip(skip)
        .limit(parsedLimit)
        .populate({
            path: "creator",
            select: 'name image'
        });

        res.status(200).json({
            success: true,
            posts,
            message: "Posts fetched successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// function to get a users posts
export const getUserPosts = async (req, res, next) => {
    try {
        const id = req.params.id;

        const posts = await Post
        .find({ creator: id })
        .sort({ createdAt: -1 }) 
        .populate({
            path: "creator",
            select: 'name image'
        });

        res.status(200).json({
            success: true,
            posts,
            message: "Posts fetched successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// function to get a post by id

// function to upload new post
export const createPost = async (req, res, next) => {
    try {
        const { content } = req.body;

        console.log(req.file)

        if(!content){
            return next(new customError("Content is required", 400));
        };

        // create the post in the database with the user id and content.
        const post = await Post.create({ content, creator: req.user._id })

        await post.populate({
            path: "creator",
            select: 'name image'
        })
        

        if(req.file){
            const options = {
                folder: 'posts', // desired folder name
                resource_type: 'auto' // Default resource type (auto-detect)
            };
    
            // Check if the file is an image or video based on MIME type
            if (req.file.mimetype.startsWith('image')) {
                options.resource_type = 'image';
            } else if (req.file.mimetype.startsWith('video')) {
                options.resource_type = 'video';
            }

              const result = await cloudinary.uploader.upload(req.file.path, options);
    
              // Delete the file from disk storage after uploading to Cloudinary
              fs.unlinkSync(req.file.path);

            //   save the image url to the post in the database
            post.media.public_id = result.public_id;
            post.media.url = result.secure_url;
        } 
        await post.save();

        res.status(200).json({
            success: true,
            post,
            message: "Post created successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// function to delete a post.
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return next(new customError("Post not found", 404));
        }

        if(post.creator.toString() !== req.user._id.toString()){
            return next(new customError("You are not authorized to delete this post", 403));
        }

        // Check if the post has a media and its public_id
        if(post.media && post.media.public_id) {
            // Delete the media from Cloudinary
            const deletedVideo  = await cloudinary.uploader.destroy(post.media.public_id);
            // const deletedVideo  = await cloudinary.api.delete_resources([post.media.public_id]);
            console.log(deletedVideo);
        }

         // delete all the comments associated with the post.
         await Comment.deleteMany({ post: post._id });

         // Delete the post from the database using deleteOne()
         await Post.deleteOne({ _id: post._id });

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// function to get comments of a post.
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
        .populate({
            path: "creator",
            select: 'name image'
        });

        res.status(200).json({
            success: true,
            comments,
            message: "Comments fetched successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// function to add a comment to post.
export const addComment = async (req, res, next) => {
    try {
        const { content } = req.body;

        if(!content){
            return next(new customError("Content is required", 400));
        };

        // create the post in the database with the user id and content.
        const comment = await Comment.create({ content, creator: req.user._id, post: req.params.id });

        res.status(200).json({
            success: true,
            comment,
            message: "Comment added successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// fucntion to delete comment.
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if(!comment){
            return next(new customError("Comment not found", 404));
        }

        if(comment.creator.toString() !== req.user._id.toString()){
            return next(new customError("You are not authorized to delete this comment", 403));
        }

        // Delete the comment from the database using deleteOne()
        await Comment.deleteOne({ _id: comment._id });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}

// function to like a post.
export const likePost = async (req, res, next) => {
    try {
        
        if(!req.params.id) return next(new customError("Post id is required", 400));

        console.log(req.params)

        const post = await Post.findById(req.params.id)
        .populate({
            path: "creator",
            select: 'name image'
        })
        ;

        if(!post){
            return next(new customError("Post not found", 404));
        }

        console.log(req.user)

        // Check if the user already liked the post
        if (post.likes?.includes(req.user._id)) {
            post.likes.pull(req.user._id);
            post.likesCount--; // decrement the likes count by 1.
        }else{
             post.likes.push(req.user._id);
             post.likesCount++; // increment the likes count by 1.
        }

        await post.save();

        res.status(200).json({
            success: true,
            post,
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}


// function to like a comment.
export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if(!comment){
            return next(new customError("Post not found", 404));
        }

        // Check if the user already liked the post
        if (comment.likes?.includes(req.user._id)) {
            comment.likes.pull(req.user._id);
            comment.likesCount--;
        }else{
            comment.likes.push(req.user._id);
            comment.likesCount++;  
        }
        
        await comment.save();

        res.status(200).json({
            success: true,
            comment,
        });

    } catch (error) {
        next(new customError(error.message, 500));
    }
}