import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    FullName:{
        type : String,
        required : true
    },
    Email:{
        type : String,
        required : true,
        unique: true
    },
    PhoneNumber:{
        type : Number,
        required : true
    },
    Password:{
        type : String,
        required : true
    },
    Role:{
        type : String,
        enum : ['Student', 'Recruiter'],
        required: true
    },
    Profile:{
        Bio : {type:String},
        Skills:[{type:String}],
        Resume:{type:String},
        ResumeOriginalName:{type:String},
        Company:{type:mongoose.Schema.Types.ObjectID, ref:'Company'},
        ProfilePhoto:{
            type:String,
            default:""
        }
    },
}, {timestamps:true});
export const User = mongoose.model('User', UserSchema);
