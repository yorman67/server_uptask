import mongoose, { Schema, Document, Types } from 'mongoose'


const tasksStatus = {
    PENDING: "PENDING",
    ON_HOOLD: "ON_HOOLD",
    IN_PROGRESS: "IN_PROGRESS",
    UNDER_REVIEW: "UNDER_REVIEW",
    COMPLETED: "COMPLETED"
} as const //  only readable in this file

export type TaskStatus = typeof tasksStatus[keyof typeof tasksStatus]

export interface ITask extends Document { //typeScript
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: { type: Types.ObjectId, ref: "Project", required: true },
    status: { type: String, enum: Object.values(tasksStatus), default: tasksStatus.PENDING },
    completedBy: [{
        user: {
            type: Types.ObjectId,
            ref: "Auth",
            default: null
        },
        status:{
            type: String, 
            enum: Object.values(tasksStatus), 
            default: tasksStatus.PENDING
        }
    }],
    notes: [{
        type: Types.ObjectId,
        ref: "Note"
    }]
}, { timestamps: true })

// Midelware
//https://mongoosejs.com/docs/middleware.html
TaskSchema.pre('deleteOne',{document: true}, async function() { // la funcion no puede ser arrow function
    const taskId = this._id
    if(!taskId) return
    await mongoose.model('Note').deleteMany({task:taskId})
})

const Task = mongoose.model<ITask>("Task", TaskSchema)
export default Task