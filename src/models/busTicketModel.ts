import mongoose, { Date } from 'mongoose';

export enum TicketTypes {
    Local = 'Local',
    Foreigner = 'Foreigner'
}

export interface IBusTicket {
    ticketName: string;
    busId: mongoose.Schema.Types.ObjectId;
    source: string;
    destination: string;
    departDate: Date;
    departTime: Date;
    ticketPrice: number;
    noOfPassenger: number;
    TicketType: TicketTypes;
}
const busTicketSchema = new mongoose.Schema({
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
    departureTime: {
        type: Date,
        required: true
    },
    ArrivalTime: {
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
    TicketType: {
        type: String,
        enum: Object.values(TicketTypes),
        default: TicketTypes.Local
    }, 
   },
   { timestamps: true },

);

export const Ticket = mongoose.model('Ticket', busTicketSchema);