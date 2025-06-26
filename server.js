import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paystackRoutes from "./routes/paystackRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
// import { fileURLToPath } from 'url';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Connect DB
connectDB();

const app = express();

app.set('trust proxy', 1); 

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://kreatify-hub-ecommerce.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Add this before your API routes
// const __dirname = path.resolve();

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/frontend/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//   );
// }

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/paystack", paystackRoutes);
app.use("/api/upload", uploadRoutes);



// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);




