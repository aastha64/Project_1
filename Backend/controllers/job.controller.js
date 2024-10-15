import {Job} from '../models/job.model.js';
//job posted by admin
export const postJob = async (req,res)=> {
    try{
        const {Title, Description,  Requirements,  Salary, Location, JobType, Experience, Position,  CompanyId} = req.body;
        const userId = req.id;
        if(!Title || !Description || !Requirements || !Salary || !Location || !JobType || !Experience || !Position || !CompanyId){
          return res.status(400).json({
            message : "Something is missing.",
            success : false
          })
        };
        const job = await Job.create({
            Title,
            Description,
            Requirements : Requirements.split(","),
            Salary : Number(Salary),
            Location,
            JobType,
            Experience_Level : Experience,
            Position,
            Company : CompanyId,
            Created_by : userId
        }); 
        return res.status(201).json({
            message : "New job created successfully.",
            Job,
            success : true
        });
    }catch(error){
        console.log(error);
        
    }
}
//student
export const getAllJobs = async (req,res) => {
    try{
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                {Title : {$regex:keyword, $options:"i"}},
                {Description: {$regex:keyword, $options:"i"}},  
            ]
        };
        const jobs = await Job.find(query);
        if(!jobs){
            return res.status(404).json({
                message : "Jobs not found.",
                success : false
            })
        };
        return res.status(200).json({
            jobs,
            success : true
        })

    }catch(error){
        console.log(error);
    }
}
//student
export const getJobById = async (req,res) => {
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message : "Jobs not found.",
                success : false 
            })
        }
        return res.status(200).json({
            job,
            success : true

        })
    }catch(error){
        console.log(error);
    }
}
// no.of jobs created by admin 
export const getAdminJob = async(req,res)=>{
    try{
        const adminId = req.id;
        const jobs = await Job.find({Created_by:adminId});
        if(!jobs){
            return res.status(404).json({
                message : "Jobs not found.",
                success : false 
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
    }catch(error){
        console.log(error);
    }
}