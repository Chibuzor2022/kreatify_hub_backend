// import express from "express";
// import {
//   createOrder,
//   getOrderById,
//   updatePaymentReference,
//   getMyOrders,
//   getAllOrders,
//   deleteOrder,
// } from "../controllers/orderController.js";
// import { protect, admin } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Static and specific routes first
// router.route("/myorders").get(protect, getMyOrders);
// router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders);
// router.route("/:id/payment").put(protect, updatePaymentReference);
// router.route("/:id").get(protect, getOrderById).delete(protect, admin, deleteOrder);

// export default router;


// routes/orderRoutes.js

import express from "express";
import {
  createOrder,
  getOrderById,
  updatePaymentReference,
  getMyOrders,
  getAllOrders,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes first
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id/payment").put(protect, updatePaymentReference);
router.route("/:id").get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders);

export default router;

