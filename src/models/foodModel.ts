import mongoose from 'mongoose';

export interface Ifood {
    restaurant: mongoose.Schema.Types.ObjectId;
    foodName: string;
    foodPrice: number;
}
const foodSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    foodPrice: {
        type: Number,
        required: true
    },
   },
   { timestamps: true }

);

export const Food = mongoose.model('Food', foodSchema);