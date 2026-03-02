import mongoose from 'mongoose';

export interface IRoute {
    source: mongoose.Schema.Types.ObjectId;
    destination: mongoose.Schema.Types.ObjectId;
    duration: number;
    distance: number;
    createdAt?: Date;
    updatedAt?: Date;
}
const routeSchema = new mongoose.Schema<IRoute>({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beach',
        required: true
    },
    duration: {
        type: Number, // mins
        required: true
    },
    distance: {
        type: Number, // miles
        required: true
    },
   },
   { timestamps: true }

);

export const Route = mongoose.model('Route', routeSchema);
