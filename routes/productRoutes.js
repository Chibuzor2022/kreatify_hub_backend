import express from 'express';
import {
  getProducts,
  searchProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Static routes 
router.get('/search', searchProducts);
router.route('/').get(getProducts).post(protect, admin, createProduct);

// Dynamic route 
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
