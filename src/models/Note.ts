import mongoose, { Document, Schema, Types } from "mongoose";

export interface INote extends Document { //typeScript
    content:string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

const NoteSchema: Schema = new mongoose.Schema({//mongoose
    content: {type: String, required: true},
    createdBy: {type: Types.ObjectId, ref: "Auth", required: true},
    task: {type: Types.ObjectId, ref: "Task", required: true}
}, {timestamps: true});

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note