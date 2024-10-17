import { Application } from "../models/Application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id; // Assumes user authentication middleware sets this
        const jobId = req.params.id;

        console.log("UserId:", userId);  
        console.log("JobId:", jobId);    

        // Check if jobId is provided
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        console.log("Existing application:", existingApplication);  // Should log 'null' if no existing application

        // If application exists, return an error message
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Add the application ID to the job's applications array
        job.applications.push(newApplication._id);
        await job.save();

        // Return success message
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get the jobs applied by the user
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company', // Ensure this matches the field name in the Job schema
                model: 'Company', // Specify the model if necessary
                options: { sort: { createdAt: -1 } }, // If you want to sort companies (optional)
            }
        });


        if (!application || application.length === 0) {
            return res.status(404).json({
                message: "No applications found",
                success: false
            });
        }

        return res.status(200).json({
            application,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Admin view: Get all applicants for a specific job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find the job and populate the applications array
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        return res.status(200).json({
            job, 
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Update application status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        // Check if status is provided
        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        // Find the application by its ID
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status;
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
