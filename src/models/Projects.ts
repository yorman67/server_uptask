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

//midelware

projectSchema.pre('deleteOne', { document: true }, async function() { // la funcion no puede ser arrow function 
    const projectId = this._id
    if(!projectId) return

    const tasks = await mongoose.model('Task').find({project:projectId})
    
    console.log(tasks)

    tasks.forEach(async task => {
        await mongoose.model('Note').deleteMany({task:task._id})
    })

    await mongoose.model('Task').deleteMany({project:projectId})
})

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project