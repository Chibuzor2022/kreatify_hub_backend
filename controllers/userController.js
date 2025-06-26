import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, phone, password } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		phone,
		password,
	});

	if (user) {
		const token = generateToken(user._id);
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const token = generateToken(user._id);

  res.cookie('jwt', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token,
	});
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/'
  });
  
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.phone = req.body.phone || user.phone;

		if (req.body.password) {
			user.password = req.body.password; // Let Mongoose pre-save hook hash it
		}

		const updatedUser = await user.save();

		const token = generateToken(updatedUser._id);

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			phone: updatedUser.phone,
			isAdmin: updatedUser.isAdmin,
			token,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		if (user.isAdmin) {
			res.status(400);
			throw new Error("Can not delete admin user");
		}
		await User.deleteOne({ _id: user._id });
		res.status(200).json({ message: "User Deleted Successfully" });
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

export {
	registerUser,
	loginUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	deleteUser,
	getAllUsers,
};
