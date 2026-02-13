import mongoose, { mongo } from "mongoose";
import User from "./Models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword =await bcrypt.hash("Admin123", 10);

    const admin = new User({
        name: "Hostel Warden",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        status: "approved",
        isEmailVerified: true
    });

    await admin.save();

    console.log("Admin created Sucessfully...");
    process.exit();   

    } catch (err) {
        console.error(err);
        process.exit(1);
    }

};

createAdmin();