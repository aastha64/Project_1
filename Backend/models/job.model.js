import { application } from "express";
import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
    Title:{
        type : String,
        required : true
    },
    Description:{
        type : String,
        required : true
    },
    Requirements:{
        type : String,
        
    },
    Salary:{
        type : Number,
        required : true
    },
    Experience_Level:{
       type : Number, 
       required : true,
    },
    Location:{
        type : String,
        required : true
    },
    JobType:{
        type : String,
        required : true
    },
    Position:{
        type :Number,
        required : true
    },
    Company:{
        type : mongoose.Schema.Types.ObjectID,
        ref : 'company',
        required : true
    },
    Created_by:{
        type : mongoose.Schema.Types.ObjectID,
        ref : 'User',
        required : true
    },
    Applications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Application',
        }
    ]
},{timestamps:true});
export const Job = mongoose.model("Job", JobSchema);


