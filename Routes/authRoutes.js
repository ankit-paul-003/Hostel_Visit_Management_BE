import express from "express";
import { getPendingTeachers, loginUser, registerTeacher, updateTeacherStatus } from "../Controllers/authController.js";
import { isAdmin, verifyToken } from "../Middilewares/authMiddleware.js";

const router = express.Router();

router.post("/register-teacher", registerTeacher);
router.post("/login", loginUser);


router.get("/pending-teachers", verifyToken, isAdmin, getPendingTeachers);
router.put("/update-status/:id", verifyToken, isAdmin, updateTeacherStatus);


router.get("/all-teachers", verifyToken, isAdmin, getAllTeachers);

router.delete("/delete-teacher/:id", verifyToken, isAdmin, deleteTeacher);

router.get("/admin-stats", verifyToken, isAdmin, getAdminStats);


export default router;