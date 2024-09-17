import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    cartItems: [
        {
            productId: String,
            title: String,
            image: String,
            price: String,
            quantity: Number
        }
    ],
    address: {
        addressId: String,
        addressInfo: String,
        city: String,
        pincode: String,
        phone: String,
        notes: String,
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'successful', 'reject'],
        default: 'pending',
      },
    paymentMethod: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'], // Enum for paymentStatus
        default: 'pending'
      },
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String,
    payerId: String,
})

const OrderDetails = mongoose.model('order', orderSchema);

export default OrderDetails;