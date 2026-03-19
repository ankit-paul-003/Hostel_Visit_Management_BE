import express from "express";
import { deleteTeacher, getAdminStats, getAllTeachers, getPendingTeachers, getUserInfo, loginUser, logOutUser, registerTeacher, updateTeacherStatus } from "../Controllers/authController.js";
import { isAdmin, verifyToken } from "../Middilewares/authMiddleware.js";
import { userSchema, validateUser } from "../Validators/userValidate.js";

const router = express.Router();

router.post("/register-teacher", validateUser(userSchema), registerTeacher);
router.post("/login", loginUser);


router.get("/pending-teachers", verifyToken, isAdmin, getPendingTeachers);
router.put("/update-status/:id", verifyToken, isAdmin, updateTeacherStatus);


router.get("/all-teachers", verifyToken, isAdmin, getAllTeachers);

router.delete("/delete-teacher/:id", verifyToken, isAdmin, deleteTeacher);

router.get("/admin-stats", verifyToken, isAdmin, getAdminStats);

router.post("/logout", verifyToken, logOutUser);

router.get("/me", verifyToken, getUserInfo);


export default router;