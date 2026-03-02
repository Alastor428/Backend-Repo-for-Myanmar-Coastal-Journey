import mongoose from 'mongoose';

export interface ICity {
    cityName: string;
    createdAt?: Date;
    updatedAt?: Date;
}
const citySchema = new mongoose.Schema<ICity>({
    cityName: {
        type: String,
        required: true,
        unique: true
    }
    },
    { timestamps: true }
);

export const City = mongoose.model('City', citySchema);