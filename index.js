import express from 'express';
import cors from 'cors';
import "dotenv/config"
import { connectDB } from './Models/db.js';
import authRoutes from "./Routes/authRoutes.js";
import adminOpRoutes from "./Routes/adminOpRoutes.js";
import teacherOpRoutes from "./Routes/teacherOpRoutes.js";



const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminOpRoutes);
app.use("/api/teacher", teacherOpRoutes);



connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
