import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import "dotenv/config";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// express setup
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// endpoint setup
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(7000, () => {
    console.log("server is running on localhost:7000");
});