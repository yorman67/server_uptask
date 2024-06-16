import  express  from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import  projectRoutes from './routes/projectRoutes'

// getting .env variables
dotenv.config()

// connecting to database
connectDB()

// initializing express
const app = express();

// read body
app.use(express.json())

// Routes
app.use('/api/newProjects',projectRoutes)
app.use('/api/projects',projectRoutes)
app.use('/api/project/:id',projectRoutes)


export default app