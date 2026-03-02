import mongoose from 'mongoose';

export interface Ifood {
    restaurant: mongoose.Types.ObjectId;
    foodName: string;
    foodPrice: number;

}
const foodSchema = new mongoose.Schema<Ifood>({
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

);

export const Food = mongoose.model('Food', foodSchema);