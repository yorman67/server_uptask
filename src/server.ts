import  express  from "express";
import dotenv from "dotenv";
import corse from "cors"
import {corsConfig} from "./config/cors"
import { connectDB } from "./config/db";
import  projectRoutes from './routes/projectRoutes'
import morgan from "morgan";

// getting .env variables
dotenv.config()

// connecting to database
connectDB()

// initializing express
const app = express();

//cors
app.use(corse(corsConfig))

//Logger
app.use(morgan('dev'))
// read body
app.use(express.json())

// Routes
app.use('/api/newProjects',projectRoutes)
app.use('/api/projects',projectRoutes)
app.use('/api/project/:id',projectRoutes)


export default app