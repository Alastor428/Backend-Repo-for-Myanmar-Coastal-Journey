import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
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