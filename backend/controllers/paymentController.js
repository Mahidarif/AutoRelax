import crypto from 'crypto';
import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PendingPayment from '../models/PendingPayment.js';

const getCurrentDateTime = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};

const getExpiryDateTime = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};

export const initiateJazzCashPayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array()[0].msg);
    res.status(400);
    return next(err);
  }

  const { orderData } = req.body;

  try {
    const merchantId = process.env.JAZZCASH_MERCHANT_ID || 'mock_merchant_id';
    const password = process.env.JAZZCASH_PASSWORD || 'mock_password';
    const salt = process.env.JAZZCASH_SALT || 'mock_salt';
    const returnUrl = process.env.JAZZCASH_RETURN_URL || 'http://localhost:5000/api/payments/jazzcash/callback';

    const txnRefNo = `T${Date.now()}`;

    // Securely calculate prices on backend
    const itemsPrice = orderData.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = orderData.shippingOption === 'pickup' ? 0 : 250;
    const totalPrice = itemsPrice + shippingPrice;

    const finalOrderData = {
      ...orderData,
      user: req.user?._id || null,
      itemsPrice,
      shippingPrice,
      totalPrice,
    };

    // Save pending payment record to database
    await PendingPayment.create({
      txnRefNo,
      orderData: finalOrderData,
    });

    const amountPaisa = Math.round(totalPrice * 100).toString();

    const fields = {
      pp_Version: '1.1',
      pp_TxnType: '', // Hosted Checkout Portal
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amountPaisa,
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: getCurrentDateTime(),
      pp_BillReference: txnRefNo, // Set to txnRefNo since order is not created yet
      pp_Description: 'AutoRelax Order Payment',
      pp_TxnExpiryDateTime: getExpiryDateTime(),
      pp_ReturnURL: returnUrl,
    };

    const sortedKeys = Object.keys(fields).sort();
    const rawString = sortedKeys
      .map(key => fields[key])
      .filter(val => val !== undefined && val !== null && val !== '')
      .join('&');

    const secureHash = crypto.createHmac('sha256', salt).update(rawString).digest('hex').toUpperCase();

    res.status(200).json({
      postUrl: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantcardpayment',
      fields: {
        ...fields,
        pp_SecureHash: secureHash
      }
    });
  } catch (err) {
    next(err);
  }
};

export const handleJazzCashCallback = async (req, res, next) => {
  try {
    const fields = { ...req.body };
    const receivedHash = fields.pp_SecureHash;
    delete fields.pp_SecureHash;

    const salt = process.env.JAZZCASH_SALT || 'mock_salt';
    const sortedKeys = Object.keys(fields).sort();
    const rawString = sortedKeys
      .map(key => fields[key])
      .filter(val => val !== undefined && val !== null && val !== '')
      .join('&');

    const calculatedHash = crypto.createHmac('sha256', salt).update(rawString).digest('hex').toUpperCase();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (receivedHash !== calculatedHash) {
      return res.redirect(`${clientUrl}/checkout?payment=failed&message=Hash%20Verification%20Failed`);
    }

    const pending = await PendingPayment.findOne({ txnRefNo: fields.pp_TxnRefNo });
    if (!pending) {
      return res.redirect(`${clientUrl}/checkout?payment=failed&message=Transaction%20session%20expired`);
    }

    if (fields.pp_ResponseCode === '000') {
      // 1. Place the order now that payment is confirmed
      const order = new Order({
        ...pending.orderData,
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: fields.pp_TxnRefNo,
          status: fields.pp_ResponseCode,
          update_time: new Date().toISOString(),
          email_address: pending.orderData.shippingAddress.email || 'guest@autorelax.com',
          mobile_number: fields.pp_MobileNo || '',
        },
      });

      // 2. Deduct inventory
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          await product.save();
        }
      }

      await order.save();
      await PendingPayment.deleteOne({ _id: pending._id });

      return res.redirect(`${clientUrl}/order/${order._id}?payment=success`);
    }

    // Payment failed or declined - clean up temporary record
    await PendingPayment.deleteOne({ _id: pending._id });
    res.redirect(`${clientUrl}/checkout?payment=failed&message=${encodeURIComponent(fields.pp_ResponseMessage || 'Payment declined')}`);
  } catch (err) {
    next(err);
  }
};
