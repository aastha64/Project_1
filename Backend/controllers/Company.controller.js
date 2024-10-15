import { Company } from "../models/company.model.js";


export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        // Check if companyName is provided in the request body
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Ensure that the user ID is present in the request (e.g., from an authenticated session or token)
        const userId = req.id; // Adjust if user ID is stored differently
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: User ID is required.",
                success: false
            });
        }

        // Check if a company with the same name already exists
        let existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Optional: Check if a company with a null name exists (but should be enforced at schema level)
        const existingNullCompany = await Company.findOne({ name: null });
        if (existingNullCompany) {
            return res.status(400).json({
                message: "A company with a null name already exists. Please contact support.",
                success: false
            });
        }

        // Create the new company
        const company = await Company.create({
            name: companyName,
            userId: userId
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Error registering company:", error);

        // Check for duplicate key error (code 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Duplicate company name. Please choose a different name.",
                success: false
            });
        }

        // Handle any other errors
        return res.status(500).json({
            message: "An error occurred while registering the company.",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        // idhar cloudinary ayega
    
        const updateData = { name, description, website, location};

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}