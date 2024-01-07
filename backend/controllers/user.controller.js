import CustomError from "../utils/customErrors.js";
import Users from "../models/user.model.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import fs from "fs";

//for registration of new users
export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if(!name || !email || !password){
        next(new CustomError("Please fill all the fields", 400));
    }

    let user = await Users.findOne({ email });
    if (user) {
        return next(new CustomError("User already exists.Try different email.", 400));
    }

    user =  await Users.create({ name, email, password,});
    await user.save();
    const token = await user.generateToken();
    // Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return res
        .status(201)
        .cookie("token", token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "None",
            secure: true,
        })
        .json({
            success: true,
            user,
        });
  } catch (error) {
    next(error);
  }
}

export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
        return next(new CustomError("Incorrect email or password", 400));
    }

    //matching passwords
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
        return next(new CustomError("Incorrect email or password", 400));
    }

    //tokenGeneration
    const token = await user.generateToken();

    res.status(200)
        .cookie("token", token, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: true, sameSite: "None", secure: true })
        .json({
            success: true,
            message: "Logged in successfully",
            user,
        });
  } catch (error) {
    next(error);
  }
}

// function to return loggedUser
export const loggedUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
        success: true,
        user,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
}

// function to logout
export const logOut = async (req, res, next) => {
  try {
    return res.status(200)
            .cookie("token", null, { expires: new Date(0), httpOnly: true, sameSite: "None", secure: true })
            .json({
                success: true,
                message: "logged out successfully",
            });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
}

// update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);
    const { name, email, password } = req.body;
  
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    console.log(req.file)

    // Check if file exists and is an image
    if (req.file && req.file.mimetype.startsWith('image')) {
      if (user.image.public_id) {
        // Delete the existing profile image from Cloudinary
        await cloudinary.uploader.destroy(user.image.public_id);
      }

      const options = {
        folder: 'profile_images',
        resource_type: 'image'
      };

      const result = await cloudinary.uploader.upload(req.file.path, options);
      console.log(result)
      user.image.public_id = result.public_id;
      user.image.url = result.secure_url;

      // Delete the file from disk storage after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }else if (req.file){
      // If the uploaded file is not an image
      fs.unlinkSync(req.file.path); // Delete the file from disk storage
      return next(new CustomError("Uploaded file is not an image", 400));
    }

    await user.save();
      
    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
};

// function to follow a user
export const follow = async (req,res,next) => {
  try {
          // check if the user is trying to follow himself
          if(req.user.id === req.params.id) {
          return next(new CustomError('You can not follow yourself',400));
          }
      
          // check if the user to follow exists
          const user = await Users.findById(req.params.id);
          if(!user) {
              return next(new CustomError('User not found',404));
          }
      
          // check if it is already followed
          if(user.followers?.includes(req.user.id)) {
              return next(new CustomError('You are already following this user',400));
          }
      
          const follower = await Users.findById(req.user._id);
      
          // add the user to the followers array and increase followers count
          user.followers.push(req.user.id);
          user.followersCount++;
          await user.save();
      
          // add the user to the following array and increase following count
          follower.followings.push(req.params.id);
          follower.followingCount++;
          await follower.save();
      
          return res.status(200).json({success:"true",message: 'follow'});
  } catch (error) {
      return next(CustomError(error.message,500));
  }
}

// function to unfollow a user
export const unFollow = async (req,res,next) => {
  try {
          // check if the user is trying to unFollow himself
          if(req.user.id === req.params.id) {
          return next(new CustomError('You can not unfollow yourself',400));
          }
      
          // check if the user to unfollow exists
          const user = await Users.findById(req.params.id);
          if(!user) {
              return next(new CustomError('User not found',404));
          }
      
          // check if it is already followed
          if( !user.followers?.includes(req.user.id)) {
              return next(new CustomError('You are not following this user',400));
          }
      
          const unFollower = await Users.findById(req.user._id);
      
          // remove the follower from the follwer array and decrease the follower coutn
          user.followers = user.followers.pull(req.user.id);
          user.followersCount--;
          await user.save();

          // remove the user form the following array and decrease the following count
          unFollow.followings = unFollower.followings.pull(req.params.id);
          unFollower.followingCount--;
          await unFollower.save();
      
          return res.status(200).json({success:"true",message: 'unfollowed'});
  } catch (error) {
      return next(CustomError(error.message,500));
  }
}