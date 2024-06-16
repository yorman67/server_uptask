import mongoose, {Schema, Document} from 'mongoose'

export type ProjectType = Document & { //typescript
    projectName: string;
    clientName: string;
    description: string;
};

const projectSchema = new Schema({ //mongoose
    projectName: {type: String, required: true, trim: true},
    clientName: {type: String, required: true , trim: true},
    description: {type: String, required: true , trim: true}
});

const Project = mongoose.model<ProjectType>("Project", projectSchema);
export default Project