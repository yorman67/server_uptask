import mongoose, { PopulatedDoc, Schema, Types } from "mongoose";
import { Document } from "mongoose";
import { ITask } from "./Task";


export interface IProject extends Document  { //typescript
    projectName: string;
    clientName: string;
    description: string;
    tasks : PopulatedDoc<ITask & Document>[]
};

const projectSchema = new Schema({ //mongoose
    projectName: {type: String, required: true, trim: true},
    clientName: {type: String, required: true , trim: true},
    description: {type: String, required: true , trim: true},
    tasks : [{type: Types.ObjectId, ref: "Task"}]
}, {timestamps: true});

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project