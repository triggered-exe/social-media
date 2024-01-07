import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

 // configure the cloudinary library
 cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

  export default cloudinary;