
import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js'; // multer + Cloudinary
const router = express.Router();

router.post('/', upload.array('images', 3), (req, res) => {

if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }



  const imageUrls = req.files.map(file => file.path);
  res.status(200).json({ imageUrls });
});

export default router;

