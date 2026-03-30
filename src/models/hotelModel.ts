import mongoose from 'mongoose';

export interface IHotel {
    hotelName: string;
    beach: mongoose.Schema.Types.ObjectId;
    hotelRating: number;
}

const hotelSchema = new mongoose.Schema<IHotel>({
    hotelName: {
        type: String,
        required: true
    }, 
    beach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beach',
        required: true
    },
    hotelRating: {
        type: Number,
        required: true
    },
    }, 
{ timestamps: true }
);

export const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);