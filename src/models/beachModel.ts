import mongoose from 'mongoose';

export interface IBeach {
    beachName: string;
    region: mongoose.Schema.Types.ObjectId;
    currentSafe: boolean;
    imageUrl: string[];
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
    imageUrl: {
        type: [String],
        required: true
    }
   },
   { timestamps: true }
   
);

export const Beach = mongoose.model('Beach', beachSchema);

