import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});


// @desc    Search products
// @route   GET /api/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } },
          { brand: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		await Product.deleteOne({ _id: product._id });
		// res.json({ message: 'Product removed' });
		res.status(200).json({ message: "Product deleted" });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: "Sample name",
		price: 0,
		user: req.user._id,
		images: [],
		brand: "Sample brand",
		category: "Sample category",
		countInStock: 0,
		description: "Sample description",
	});
	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  console.log("🧪 Incoming req.body:", req.body); 
  const {
    name,
    price,
    description,
    images, // this should be an array
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Update only if values are provided
  if (name) product.name = name;
  if (price !== undefined) product.price = price;
  if (description) product.description = description;
  if (images && images.length > 0) product.images = images;
  if (brand) product.brand = brand;
  if (category) product.category = category;
  if (countInStock !== undefined) product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

export {
	getProducts,
	searchProducts,
	getProductById,
	// getMyOrders,
	deleteProduct,
	createProduct,
	updateProduct,
};
