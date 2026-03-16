import mongoose, { Document } from 'mongoose';

export interface IRegion extends Document {
    regionName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const regionSchema = new mongoose.Schema<IRegion>({
    regionName: {
        type: String,
        required: true
    },
   },
    { timestamps: true }
);

export const Region = mongoose.model('Region', regionSchema);