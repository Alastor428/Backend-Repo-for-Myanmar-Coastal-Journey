import mongoose from 'mongoose';

export interface IBeach extends Document {
    beachName: string;
    region: mongoose.Schema.Types.ObjectId;
    currentSafe: boolean;
    beachLocation: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}
const beachSchema = new mongoose.Schema({
    beachName: {
        type: String,
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
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
    imageUrl: {
        type: String,
        required: true
    }
   },
   { timestamps: true }
   
);

export const Beach = mongoose.model('Beach', beachSchema);

