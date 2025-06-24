// routes/paystack.js
import express from "express";
import axios from "axios";
// import bodyParser from 'body-parser';

const router = express.Router();

// POST /api/paystack/initialize
// Initialize a Paystack transaction from backend
router.post("/initialize", async (req, res) => {
	const { email, amount } = req.body;

	if (!email || !amount) {
		return res.status(400).json({ message: "Email and amount are required" });
	}

	try {
		const response = await axios.post(
			"https://api.paystack.co/transaction/initialize",
			{
				email,
				amount, // amount in kobo (e.g. 50000 for ₦500)
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		// Forward the data object from Paystack API response to frontend
		return res.json(response.data.data); // contains authorization_url, access_code, reference
	} catch (error) {
		console.error(
			"Paystack initialization error:",
			error.response?.data || error.message
		);
		return res
			.status(500)
			.json({ message: "Failed to initialize transaction" });
	}
});

// GET /api/paystack/verify/:reference
// Verify a Paystack transaction status
router.get("/verify/:reference", async (req, res) => {
	const { reference } = req.params;

	if (!reference) {
		return res.status(400).json({ message: "Reference is required" });
	}

	try {
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				},
			}
		);

		// Send the verification data back to frontend
		return res.json(response.data.data);
	} catch (error) {
		console.error(
			"Paystack verification error:",
			error.response?.data || error.message
		);
		return res.status(500).json({ message: "Failed to verify transaction" });
	}
});

export default router;
