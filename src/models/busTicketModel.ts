import mongoose, { Date } from 'mongoose';

export interface IBusTicket {
    ticketName: string;
    busId: mongoose.Schema.Types.ObjectId;
    source: string;
    destination: string;
    departureDate: Date;
    ticketPrice: number;
    noOfPassenger: number;
    isForeigner: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
const busTicketSchema = new mongoose.Schema<IBusTicket>({
    ticketName: {
        type: String,
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
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
    departureDate: {
        type: Date,
        required: true
    },

    ticketPrice: {
        type: Number,
        required: true
    },
    noOfPassenger: {
        type: Number,
        default: 1,
        required: true
    },
    isForeigner: {
        type: Boolean,
        default: false,
        required: true
    }
   },
   { timestamps: true },

);

export const Ticket = mongoose.model('Ticket', busTicketSchema);