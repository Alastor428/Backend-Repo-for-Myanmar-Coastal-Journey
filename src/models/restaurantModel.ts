import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    restaurantLocation: {
        type: String,
        required: true
    },
    // to connect with food document
    // to connect with region document
   },
   { timestamps: true }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);