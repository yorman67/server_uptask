import  express  from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// getting .env variables
dotenv.config()

// connecting to database
connectDB()

// initializing express
const app = express();

export default app