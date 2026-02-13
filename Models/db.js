import mongoose from "mongoose";
 
const mongo_url = process.env.MONGO_URI;

export const connectDB =  async() => {
    try {
        await mongoose.connect(mongo_url);
        console.log("Database connected sucessfully...");
    } catch (error) {
        console.log("Database connection failed...", error);
        process.exit(1);
    }
}