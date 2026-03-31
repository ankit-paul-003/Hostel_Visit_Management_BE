import express from 'express';
import { verifyToken } from '../Middilewares/authMiddleware.js';
import { getReports, submitReport } from '../Controllers/submitFormController.js';
import multer from 'multer';
import fs from 'fs';

const uploadDir = 'uploads/';
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (error) {
    console.error("Failed to create uploads directory:", error);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/submit-report", verifyToken, upload.array('images', 3), submitReport);
router.get("/reports", verifyToken, getReports);


export default router;
