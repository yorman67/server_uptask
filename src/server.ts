import  express  from "express";
import dotenv from "dotenv";
import corse from "cors"
import {corsConfig} from "./config/cors"
import { connectDB } from "./config/db";
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import morgan from "morgan";

// getting .env variables
dotenv.config()

// connecting to database
connectDB()

// initializing express
const app = express();

//cors
//app.use(corse(corsConfig))

//Logger
app.use(morgan('dev'))
// read body
app.use(express.json())

// Routes
app.use('/api/auth',authRoutes)
app.use('/api/project',projectRoutes)


export default app