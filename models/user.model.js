import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"],
    },
    email: {
        type: String,
        required: [true, "Enter your email"],
        unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, "Password must be greater than 8"],
        select: false,
    },
    image: {
        public_id: String,
        url: String
    },
    followers: [
        {
            type: mongoose.ObjectId,
            ref: "Users",
        },
    ],
    followersCount: {
        type: Number,
        default: 0,
    },
    followings: [
        {
            type: mongoose.ObjectId,
            ref: "Users",
        },
    ],
    followingCount: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});


//hashing before saving the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//method for matching passwords during login
userSchema.methods.matchPassword = async function (password) {
    console.log(password, this.password);
    return await bcrypt.compare(password, this.password);
};

//JWT Generation
userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const userModel =  mongoose.model("Users", userSchema);

export default userModel;