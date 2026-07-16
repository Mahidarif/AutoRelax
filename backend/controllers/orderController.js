import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingOption } = req.body;

  if (!orderItems?.length) {
    return res.status(400).json({ message: 'No order items' });
  }

  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = 0;
  const shippingPrice = shippingOption === 'pickup' ? 0 : 250;
  const totalPrice = itemsPrice + shippingPrice;

  const order = new Order({
    user: req.user?._id || null,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
};

export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.qty;
      await product.save();
    }
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.json(updatedOrder);
};
