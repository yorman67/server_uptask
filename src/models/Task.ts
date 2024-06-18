import mongoose, {Schema, Document, Types} from 'mongoose'


const tasksStatus = {
    PENDING: "PENDING",
    ON_HOOLD: "ON_HOOLD",
    IN_PROGRESS: "IN_PROGRESS",
    UNDER_REVIEW: "UNDER_REVIEW",
    COMPLETED: "COMPLETED"
} as const //  only readable in this file

export type TaskStatus = typeof tasksStatus[keyof typeof tasksStatus]

export interface ITask extends Document {
   name: string
   description: string 
   project : Types.ObjectId
   status : TaskStatus
 } 

 export const TaskSchema = new Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    project: {type: Types.ObjectId, ref: "Project", required: true},
    status: {type: String, enum: Object.values(tasksStatus), default: tasksStatus.PENDING}
}, {timestamps: true})

 const Task = mongoose.model<ITask>("Task", TaskSchema)
 export default Task