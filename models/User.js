import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    userName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', UserSchema);

export default User;

