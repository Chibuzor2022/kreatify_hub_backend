// import dotenv from 'dotenv';
// dotenv.config();

// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';

// // ✅ Use v1 syntax since you're now on cloudinary@1.41.0
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2, // use v2 here
//   params: {
//     folder: 'ecommerce_products',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// const upload = multer({ storage });

// export { upload };

import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary, 
  params: {
    folder: 'ecommerce_products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Multer upload middleware
const upload = multer({ storage });

export { upload };
