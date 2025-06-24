import mongoose from "mongoose";

const productSchema = mongoose.Schema(
	{
		user: {
			// User who created the product (admin)
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: {
			type: String,
			required: true,
		},
images: {
  type: [String],
  default: [],
},
  	brand: {
			type: String,
			required: true,
		},

		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
	
		price: {
			type: Number,
			required: true,
			default: 0,
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model("Product", productSchema);

export default Product;
