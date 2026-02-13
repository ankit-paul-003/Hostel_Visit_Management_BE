import User from "../Models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({ message: "User Already Exist "});
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
            message: "Registratin submitted. waiting for admin approval."
        })
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};



export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ message: "User not found "});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ message: "Invalid Credentials"});
        }

        if(user.role === "teacher" && user.status !== "approved"){
            return res.status(403).json({
                message: "Your registration is pending admin approval."
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        );

        res.json({
            message: "Login Sucessfull.",
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
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

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: "teacher" })
            .select("-password"); // hide password

        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.json({ message: "Teacher deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
};

