import mongoose, { PopulatedDoc, Schema, Types } from "mongoose";
import { Document } from "mongoose";
import { ITask } from "./Task";
import { IAuth } from "./Auth";


export interface IProject extends Document  { //typescript
    projectName: string
    clientName: string
    description: string
    tasks : PopulatedDoc<ITask & Document>[]
    manager : PopulatedDoc<IAuth & Document>
    team : PopulatedDoc<IAuth & Document>[]
};

const projectSchema = new Schema({ //mongoose
    projectName: {type: String, required: true, trim: true},
    clientName: {type: String, required: true , trim: true},
    description: {type: String, required: true , trim: true},
    tasks : [{type: Types.ObjectId, ref: "Task"}],
    manager : {type: Types.ObjectId, ref: "Auth"},
    team : [{type: Types.ObjectId, ref: "Auth"}]
}, {timestamps: true});

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project