import express from "express";
import { isAdmin, verifyToken } from "../Middilewares/authMiddleware.js";
import { userSchema, validateUser } from "../Validators/userValidate.js";
import { adminCreateAdmin, adminCreateTeacher, deleteAdmin, deleteTeacher, getAdminStats, getAllAdmin, getAllTeachers, getPendingTeachers, getUserInfoById, updateTeacher, updateTeacherStatus } from "../Controllers/authController.js";
import { createForwardContact, deleteForwardContact, getForwardContacts, updateForwardContact } from "../Controllers/forwardContactController.js";
import { getAllComplaints, updateComplaintStatus } from "../Controllers/complaintController.js";

const router = express.Router();

router.post("/create-admin", verifyToken, isAdmin, validateUser(userSchema), adminCreateAdmin)
router.post("/create-teacher", verifyToken, isAdmin, validateUser(userSchema), adminCreateTeacher);
router.get("/pending-teachers", verifyToken, isAdmin, getPendingTeachers);
router.put("/update-status/:id", verifyToken, isAdmin, updateTeacherStatus);


// Forward complaints contacts (add/edit/delete)
router.get("/forward-contacts", verifyToken, isAdmin, getForwardContacts);
router.post("/forward-contacts", verifyToken, isAdmin, createForwardContact);
router.put("/forward-contacts/:id", verifyToken, isAdmin, updateForwardContact);
router.delete("/forward-contacts/:id", verifyToken, isAdmin, deleteForwardContact);

// Forward complaints main flow (list + update status)
router.get("/complaints", verifyToken, isAdmin, getAllComplaints);
router.put("/complaints/:id/status", verifyToken, isAdmin, updateComplaintStatus);


router.get("/all-teachers", verifyToken, isAdmin, getAllTeachers);
router.get("/all-admin", verifyToken, isAdmin, getAllAdmin)

router.delete("/delete-teacher/:id", verifyToken, isAdmin, deleteTeacher);
router.delete("/delete-admin/:id", verifyToken, isAdmin, deleteAdmin);
router.get("/teacher/:id", verifyToken, isAdmin, getUserInfoById);
router.put("/update-teacher/:id", verifyToken, isAdmin, updateTeacher);

router.get("/admin-stats", verifyToken, isAdmin, getAdminStats);

export default router;
