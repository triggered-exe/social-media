import express from 'express';
const router = express.Router();
import { getAllPost,getSinglePost, getUserPosts, createPost, getComments, addComment, deleteComment, deletePost, likePost, likeComment } from '../controllers/post.controller.js';
import isAuthenticated from "../middlewares/authentication.middleware.js";
import multer from '../middlewares/multer.middleware.js'

router.get('/', (req, res, next) => { 
    try{
       res.status(200).json({message: 'Welcome to the post route'})
    }catch(err){
        next(err);
    }
})

router.route('/getpost').get(isAuthenticated, getAllPost);
router.route('/getsinglepost/:id').get(isAuthenticated, getSinglePost);
router.route('/getuserposts/:id').get(isAuthenticated, getUserPosts);
router.route('/create').post(isAuthenticated, multer.single("file"), createPost);
router.route('/deletepost/:id').delete(isAuthenticated, deletePost);
router.route('/getcomments/:id').get(isAuthenticated, getComments);
router.route('/addcomment/:id').post(isAuthenticated, addComment);
router.route('/deletecomment/:id').delete(isAuthenticated, deleteComment);
router.route('/likepost/:id').post(isAuthenticated, likePost);
router.route('/like/comment/:id').post(isAuthenticated, likeComment);

export default router;