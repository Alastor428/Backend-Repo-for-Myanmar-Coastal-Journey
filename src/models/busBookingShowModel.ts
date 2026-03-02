import mongoose, { Types } from "mongoose";

export enum SeatStatus {
    Available = 'Available',
    Selected = 'Selected',
    Unavailable = 'Unavailable'
}
export interface IBusShow {
    bus: Types.ObjectId;
    ticket: Types.ObjectId;
    startTime: string;
    priceMap: Record<string, number>;
    seatLayout: {
        row: string;
        seats : {
            number: number;
            status: SeatStatus;
        }[];
    }[];
    selectedBy?: mongoose.Schema.Types.ObjectId;
    selectedAt?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

const busShowSchema = new mongoose.Schema<IBusShow>({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    startTime: {
        type: String,
        required: true
    },

    selectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    selectedAt: {
        type: Date,
    }, 
   },
    { timestamps: true }
);

export const Seat = mongoose.model('Seat', busShowSchema);
