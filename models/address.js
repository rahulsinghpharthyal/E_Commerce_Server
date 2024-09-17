import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    userId: String,
    address: String,
    city: String,
    phone: String,
    pincode: String,
    notes: String,

},{timestamps: true});

const UserAddress = mongoose.model('UserAddress', AddressSchema);

export default UserAddress;