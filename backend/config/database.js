import mongoose from "mongoose";   
import CustomError from "../utils/customErrors.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;