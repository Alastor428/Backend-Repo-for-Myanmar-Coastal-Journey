import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
    regionName: {
        type: String,
        required: true
    },
   },
    { timestamps: true }
);

export const Region = mongoose.model('Region', regionSchema);