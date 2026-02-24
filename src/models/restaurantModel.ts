import mongoose from 'mongoose';

export interface IRestaurant {
    restaurantName: string;
    region: mongoose.Schema.Types.ObjectId;
    beach: mongoose.Schema.Types.ObjectId;
    phone: string;
}
const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    beach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beach',
        required: true
    },
    phone: {
        type: String,
        required: true
    }
   },
   { timestamps: true }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);