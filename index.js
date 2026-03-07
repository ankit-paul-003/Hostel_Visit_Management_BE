import express from 'express';
import cors from 'cors';
import "dotenv/config"
import { connectDB } from './Models/db.js';
import authRoutes from "./Routes/authRoutes.js";


const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

