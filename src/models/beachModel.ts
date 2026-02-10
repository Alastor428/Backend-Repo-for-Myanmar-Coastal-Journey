import mongoose from 'mongoose';

export interface IBeach extends Document {
    beachName: string;
    currentSafe: boolean;
    beachLocation: string;
    region: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
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
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region'
    }
   },
   { timestamps: true }
   
);

export const Beach = mongoose.model('Beach', beachSchema);

