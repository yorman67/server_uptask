import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";
dotenv.config();


type JwtPayload = {
    id: Types.ObjectId
}
export const generateJWT = (payload: JwtPayload) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
    });
}