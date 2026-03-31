import express from "express";
import { getUserInfo, loginUser, logOutUser, registerTeacher } from "../Controllers/authController.js";
import { verifyToken } from "../Middilewares/authMiddleware.js";
import { userSchema, validateUser } from "../Validators/userValidate.js";

const router = express.Router();

router.post("/register-teacher", validateUser(userSchema), registerTeacher);
router.post("/login", loginUser);

router.post("/logout", verifyToken, logOutUser);

router.get("/me", verifyToken, getUserInfo);


export default router;