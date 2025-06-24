// Import the mongoose library for MongoDB interaction
import mongoose from "mongoose";

// Define an asynchronous function to connect to MongoDB
const connectDB = async () => {
	try {
		// Attempt to connect to the MongoDB database using the connection URI
		const conn = await mongoose.connect(process.env.MONGO_URI);

		// Log a success message including the host of the connected MongoDB server
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		// If an error occurs during the connection attempt, log the error message
		console.error(`Error: ${error.message}`);

		// Exit the Node.js process with a non-zero status code to indicate failure
		process.exit(1);
	}
};

// Export the connectDB function as the default export from this module
export default connectDB;
