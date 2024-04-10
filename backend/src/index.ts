import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import "dotenv/config";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// endpoint setup
app.use("/api/users", userRoutes);

app.listen(7000, () => {
    console.log("server is running on localhost:7000");
});