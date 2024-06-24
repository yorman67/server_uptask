import mongoose, { Document,Schema, Types } from "mongoose";

export interface IAuth extends Document {
    token: string;
    user: Types.ObjectId;
    createdAt: Date;
}

const tokenSchema : Schema = new Schema({   
    token: {type: String, required: true},
    user: {type: Types.ObjectId, ref: "Auth", required: true},
    createdAt: {type: Date, default: Date.now, expires: "10m"}
})

const token = mongoose.model<IAuth>("Token", tokenSchema);
export default token