import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 149.99,
    category: 'Electronics',
    brand: 'SoundMax',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    countInStock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Fitness tracking, heart rate monitor, and smartphone notifications.',
    price: 299.99,
    category: 'Electronics',
    brand: 'TechWear',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    countInStock: 15,
    rating: 4.8,
    numReviews: 8,
  },
  {
    name: 'Classic Leather Jacket',
    description: 'Genuine leather jacket with modern slim fit design.',
    price: 189.99,
    category: 'Fashion',
    brand: 'UrbanStyle',
    image: 'https://images.unsplash.com/photo-1551028711-00167b16eac5?w=400',
    countInStock: 10,
    rating: 4.3,
    numReviews: 5,
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight running shoes with responsive cushioning.',
    price: 119.99,
    category: 'Fashion',
    brand: 'RunFast',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    countInStock: 30,
    rating: 4.6,
    numReviews: 20,
  },
  {
    name: 'Organic Coffee Beans',
    description: 'Single-origin Arabica beans, medium roast, 1kg bag.',
    price: 24.99,
    category: 'Food',
    brand: 'BeanCraft',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    countInStock: 50,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip eco-friendly yoga mat with carrying strap.',
    price: 49.99,
    category: 'Sports',
    brand: 'FlexFit',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    countInStock: 40,
    rating: 4.4,
    numReviews: 9,
  },
  {
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with USB charging port.',
    price: 39.99,
    category: 'Home',
    brand: 'BrightHome',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed557e0fcd?w=400',
    countInStock: 35,
    rating: 4.2,
    numReviews: 7,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound.',
    price: 79.99,
    category: 'Electronics',
    brand: 'SoundMax',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    countInStock: 20,
    rating: 4.5,
    numReviews: 11,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shop.com',
      password: 'admin123',
      isAdmin: true,
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@shop.com / admin123');
    console.log('User login: john@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
