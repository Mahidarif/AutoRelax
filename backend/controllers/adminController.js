import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// GET /api/admin/stats — Dashboard summary cards
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({});
    const products = await Product.find({});
    
    // Map of product ID -> purchasePrice
    const costMap = {};
    products.forEach(p => {
      costMap[p._id.toString()] = p.purchasePrice || 0;
    });

    const totalSales = orders.reduce((s, o) => s + o.totalPrice, 0);
    
    let totalPurchases = 0;
    orders.forEach(o => {
      o.orderItems.forEach(item => {
        const costPrice = costMap[item.product?.toString()] || 0;
        totalPurchases += costPrice * item.qty;
      });
    });

    const totalExpenses = orders.reduce((s, o) => s + o.shippingPrice, 0);
    const invoiceDue = orders.filter(o => !o.isPaid).reduce((s, o) => s + o.totalPrice, 0);

    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ countInStock: { $gt: 0, $lte: 5 } });
    const outOfStock = await Product.countDocuments({ countInStock: 0 });
    const totalUsers = await User.countDocuments();

    res.json({
      totalSales,
      totalPurchases,
      totalExpenses,
      invoiceDue,
      totalOrders,
      totalProducts,
      lowStock,
      outOfStock,
      totalUsers,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/inventory — Inventory table data
export const getInventory = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    const products = await Product.find(keyword).sort({ updatedAt: -1 });

    const inventory = products.map(p => ({
      _id: p._id,
      name: p.name,
      image: p.image,
      category: p.category,
      brand: p.brand,
      price: p.price,
      purchasePrice: p.purchasePrice || 0,
      countInStock: p.countInStock,
      lastUpdated: p.updatedAt,
      status:
        p.countInStock === 0 ? 'Out of Stock'
        : p.countInStock <= 5 ? 'Low Stock'
        : 'In Stock',
    }));

    res.json({
      items: inventory,
      totalItems: inventory.length,
      lowStockItems: inventory.filter(i => i.status === 'Low Stock').length,
      outOfStockItems: inventory.filter(i => i.status === 'Out of Stock').length,
      inStockItems: inventory.filter(i => i.status === 'In Stock').length,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reports — Monthly sales/profit data
export const getReports = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: 1 });
    const products = await Product.find({});
    
    // Map of product ID -> purchasePrice
    const costMap = {};
    products.forEach(p => {
      costMap[p._id.toString()] = p.purchasePrice || 0;
    });

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Monthly revenue breakdown
    const monthlyData = months.map((m, i) => {
      const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === i);
      const revenue = monthOrders.reduce((s, o) => s + o.totalPrice, 0);
      const expenses = monthOrders.reduce((s, o) => s + o.shippingPrice, 0);
      
      let totalCostOfItems = 0;
      monthOrders.forEach(o => {
        o.orderItems.forEach(item => {
          const costPrice = costMap[item.product?.toString()] || 0;
          totalCostOfItems += costPrice * item.qty;
        });
      });

      const profit = revenue - expenses - totalCostOfItems;
      return { month: m, revenue, expenses, profit, loss: profit < 0 ? Math.abs(profit) : 0 };
    });

    const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
    const totalExpenses = orders.reduce((s, o) => s + o.shippingPrice, 0);
    
    let totalItemsCost = 0;
    orders.forEach(o => {
      o.orderItems.forEach(item => {
        const costPrice = costMap[item.product?.toString()] || 0;
        totalItemsCost += costPrice * item.qty;
      });
    });

    const totalProfit = totalRevenue - totalExpenses - totalItemsCost;

    // Recent expenses list
    const recentExpenses = orders.slice(-10).map(o => ({
      _id: o._id,
      description: `Order #${o._id.toString().slice(-6)}`,
      amount: o.shippingPrice,
      total: o.totalPrice,
      date: o.createdAt,
    }));

    res.json({
      monthlyData,
      totalRevenue,
      totalExpenses,
      totalProfit,
      recentExpenses,
    });
  } catch (err) {
    next(err);
  }
};
