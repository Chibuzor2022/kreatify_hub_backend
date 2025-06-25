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
import { fileURLToPath } from 'url';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Connect DB
connectDB();

const app = express();

app.set('trust proxy', 1); 

// Middleware
app.use(cors({
  origin: "https://kreatify-hub-ecommerce.vercel.app",
  origin: "http://localhost:5173", // For local development with Vite  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Serve frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) =>
    res.sendFile(path.join(frontendPath, 'index.html'))
  );
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);





// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import paystackRoutes from "./routes/paystackRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Connect to database
// connectDB();

// const app = express();

// // Recreate __dirname for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static files from the frontend's dist folder
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// // Trust proxy for production deployment
// app.set('trust proxy', 1);

// // Configure CORS with proper origin validation
// const allowedOrigins = [
//   "https://kreatify-hub-ecommerce.vercel.app",
//   "http://localhost:5173" // For local development
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   exposedHeaders: ["Authorization"],
//   optionsSuccessStatus: 200
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// // Middleware
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API Routes
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/paystack", paystackRoutes);
// app.use("/api/upload", uploadRoutes);

// // Catch-all route for non-API requests
// app.get('/*', (req, res) => {
//   try {
//     if (req.path.startsWith('/api')) {
//       return res.status(404).json({ message: 'API endpoint not found' });
//     }

//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//   } catch (error) {
//     console.error('Error serving frontend:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ 
//     status: "healthy",
//     timestamp: new Date().toISOString()
//   });
// });

// // Root endpoint
// app.get("/", (req, res) => {
//   res.send(`
//     <h1>Kreatify Hub API</h1>
//     <p>Server is running</p>
//     <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
//   `);
// });

// // Serve frontend in production
//   app.get('/*', (req, res) => {
//   if (req.path.startsWith('/api')) {
//     return res.status(404).json({ message: 'API endpoint not found' });
//   }

//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });




// // Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`
//     Server running in ${process.env.NODE_ENV || 'development'} mode
//     Listening on port ${PORT}
//     CORS enabled for origins: ${allowedOrigins.join(', ')}
//   `);
// });

