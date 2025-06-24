import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import axios from 'axios';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const validatedItems = orderItems.map((item) => {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      throw new Error(`Invalid product ID: ${item.product}`);
    }
    return {
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    };
  });

  const order = new Order({
    user: req.user._id,
    orderItems: validatedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentResult: {
      id: 'pending',
      status: 'pending',
    },
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Update order with Paystack reference
// @route   PUT /api/orders/:id/payment
// @access  Private
const updatePaymentReference = asyncHandler(async (req, res) => {
  const { reference } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.paymentResult = {
    id: reference,
    status: 'initiated',
    update_time: new Date().toISOString(),
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Verify Paystack payment
// @route   GET /api/orders/:id/verify
// @access  Private
const verifyOrderPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.isPaid) {
    return res.json(order);
  }

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${order.paymentResult?.id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const paymentData = response.data.data;

  if (paymentData.status === 'success' && paymentData.amount === order.totalPrice * 100) {
    order.isPaid = true;
    order.paidAt = new Date(paymentData.paid_at || Date.now());
    order.paymentResult = {
      id: paymentData.reference,
      status: paymentData.status,
      update_time: new Date().toISOString(),
      email_address: paymentData.customer?.email,
    };

    await order.save();
    return res.json(order);
  }

  res.status(400);
  throw new Error('Payment verification failed');
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
});


// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id  
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Optional: Add admin check
    if (!req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
   await Order.deleteOne({ _id: req.params.id });
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  createOrder,
  updatePaymentReference,
  verifyOrderPayment,
  getMyOrders,
  getAllOrders, 
  getOrderById,
  deleteOrder
};










