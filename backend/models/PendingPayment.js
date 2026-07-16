import mongoose from 'mongoose';

const pendingPaymentSchema = new mongoose.Schema({
  txnRefNo: { type: String, required: true, unique: true },
  orderData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // auto-expires in 1 hour
});

const PendingPayment = mongoose.model('PendingPayment', pendingPaymentSchema);
export default PendingPayment;
