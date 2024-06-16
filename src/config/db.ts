import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${conn.connection.host}:${conn.connection.port}`
        console.log(colors.yellow.bold(`MongoDB Connected: ${url}`));

    } catch (error) {
        console.log(colors.red.bold(`conection error in mongodb: ${error.message}`));
        process.exit(1);
    }
}