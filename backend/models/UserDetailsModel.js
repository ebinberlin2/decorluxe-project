// models/UserDetailsModel.js
import mongoose from 'mongoose';

const userDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

export default UserDetails;
