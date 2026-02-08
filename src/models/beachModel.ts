import mongoose from 'mongoose';

const beachSchema = new mongoose.Schema({
    beachName: {
        type: String,
        required: true
    },
    currentSafe: {
        type: Boolean,
        required: true
    },
    beachLocation: {
        type: String,
        required: true
    },
   },
   { timestamps: true }
   //to connect with region document
);

export const Beach = mongoose.model('Beach', beachSchema);

