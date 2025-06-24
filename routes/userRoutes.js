import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getAllUsers,
	deleteUser,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);

// Admin Protected Route
router.route("/").get(protect, admin, getAllUsers);
router.route("/:id").delete(protect, admin, deleteUser);

export default router;
