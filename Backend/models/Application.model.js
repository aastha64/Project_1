import mongoose from "mongoose";
const ApplicationSchema = new mongoose.Schema({
    Job:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required:true
    },
    Applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    Status:{
        typr:String,
        enum:['Pending', 'Accepted', 'Rejected'],
        default:'Pending'
    }
},{timestamps:true}
);
export const Application = mongoose.models("Application", ApplicationSchema);


