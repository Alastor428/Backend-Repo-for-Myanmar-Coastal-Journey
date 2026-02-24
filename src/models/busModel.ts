import mongoose, { Date } from 'mongoose';

export enum BusStatus {
    Available = 'Available',
    Unavailable = 'Unavailable'
}

export interface IBus {
    regionId: mongoose.Schema.Types.ObjectId;
    noOfSeats: number;
    source: string;
    destination: string;
    startTime: Date;
    endTime: Date;
    busStatus: BusStatus;
}
const busSchema = new mongoose.Schema({
    regionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    busStatus: {
        type: String,
        enum: Object.values(BusStatus),
        default: BusStatus.Available
    },
   },
    { timestamps: true }
);

export const Bus = mongoose.model('Bus', busSchema);