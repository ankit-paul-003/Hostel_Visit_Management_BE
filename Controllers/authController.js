import User from "../Models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const registerTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User Already Exist, Plealse try to Log In."
             });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new User({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
            status: "pending"

        });

        await newTeacher.save();

        res.status(201).json({
            success: true,
            message: "Registratin submitted. waiting for admin approval.",
            _id: newTeacher._id,
            data:newTeacher
        })
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found " });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: "Incorrect Password." });
        }

        if(user.status === "pending"){
            return res.status(403).json({
               success: false,
               message: "Your profile is not verified yet." 
            })
            
        }else if(user.status === "rejected"){
            return res.status(403).json({
                sucess: false,
                message: "Your account is Suspended, contact to the Warden."
            })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, tokenVersion: user.tokenVersion ?? 0 },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            message: "Login Sucessfull.",
            _id: user._id,
            token,
            role: user.role,
            status: user.status,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message })
    }
};


export const updateTeacherStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const teacher = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.json({
            message: `Teacher ${status} successfully`,
            teacher
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





//Admin operaions-----------------------------
export const adminCreateTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User Already Exist, Please try to Log In."
             });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new User({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
            status: "approved"

        });

        await newTeacher.save();

        res.status(201).json({
            success: true,
            message: "Registratin submitted. waiting for admin approval.",
            _id: newTeacher._id,
            data:newTeacher
        })
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
};


export const getPendingTeachers = async (req, res) => {
    try {
        const teachers = await User.find({
            role: "teacher",
            status: "pending"
        });

        res.json(teachers);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: "teacher" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message });
    }
};

export const getAllAdmin = async (req, res) => {
    try {
        const admin = await User.find({ role: "admin" })
        .select("-password")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.json({ success: true, message: "Teacher deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserInfoById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting user info", error: error.message
        })
    }
}

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const teacher = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        ).select("-password");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            message: "Teacher updated successfully",
            data: teacher
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const totalTeachers = await User.countDocuments({ role: "teacher" });
        const pendingTeachers = await User.countDocuments({
            role: "teacher",
            status: "pending"
        });
        const approvedTeachers = await User.countDocuments({
            role: "teacher",
            status: "approved"
        });

        res.json({
            totalTeachers,
            pendingTeachers,
            approvedTeachers
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message });
    }
};









export const logOutUser = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        // Invalidate all previously issued JWTs for this user
        await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserInfo = async (req, res)=> {
    try {
        const userId = req.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });
        }

        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting user info", error: error.message
        })
    }
}

export const adminCreateAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name||!email||!password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingAdmin = await User.findOne({ email });

        if(existingAdmin){
            return res.status(400).json({
                success: false,
                message: "Admin already Exist, Find in list below. "
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            status: "approved"
        })

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin Added Successfully.",
            _id: newAdmin._id,
            data: newAdmin
        })
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent the logged in admin from deleting themselves
        const currentUserId = req.userId || req.user?.id;
        if (id === currentUserId) {
            return res.status(403).json({ success: false, message: "You cannot delete yourself." });
        }
        
        // Optional: Protect the main admin by email (change the email to your actual main admin email)
        const adminToDelete = await User.findById(id);
        if (adminToDelete && adminToDelete.email === process.env.ADMIN_MAIL) {
            return res.status(403).json({ success: false, message: "Main admin cannot be deleted." });
        }

        await User.findByIdAndDelete(id);
        res.json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
