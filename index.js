import express from 'express';
import connection from './config/database.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8000;
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import errorMiddleware from './middlewares/customError.middleware.js';
import cors from 'cors';

dotenv.config();
connection();
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000','https://social-media-clone-mern-stack.vercel.app', process.env.Frontend_URL], // Allow requests from this origin
    credentials: true, // Include credentials in the request
  })
);

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/api/user', userRouter);
app.use('/api/post', postRouter);


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

