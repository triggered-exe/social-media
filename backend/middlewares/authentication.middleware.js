import Users from "../models/user.model.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customErrors.js";


const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new CustomError("Please login first", 401));
        }
        const authentication = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Users.findById(authentication._id);
        next();
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

export default isAuthenticated;