import express from 'express';
const router = express.Router();
import CustomError from "../utils/customErrors.js";
import isAuthenticated from "../middlewares/authentication.middleware.js";
import multer from '../middlewares/multer.middleware.js'
import { signUp, logIn, loggedUser, logOut, updateProfile, follow, unFollow } from '../controllers/user.controller.js';

router.get('/', (req, res, next) => { 
    try{
       res.status(200).json({message: 'Welcome to the user page'})
    }catch(err){
        next(err);
    }
})

router.route('/signup').post(signUp);
router.route('/login').post(logIn);
router.route('/loggeduser').get(isAuthenticated, loggedUser);
router.route('/logout').post( isAuthenticated, logOut);
router.route('/update-profile').put( isAuthenticated, multer.single("profile"), updateProfile);
router.route('/follow/:id').post(isAuthenticated, follow);
router.route('/unfollow/:id').post(isAuthenticated, unFollow);

export default router;