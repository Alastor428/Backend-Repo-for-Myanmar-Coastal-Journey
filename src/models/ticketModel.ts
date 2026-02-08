import { Decimal128, Timestamp } from 'bson';
import mongoose from 'mongoose';

export enum TicketTypes {
    Local = 'Local',
    Foreigner = 'Foreigner'
}

const ticketSchema = new mongoose.Schema({
    ticketName: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    departDate: {
        type: Date,
        required: true
    },
    departTime: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    Adult: {
        type: 
    },
    TicketType: {
        type: String,
        enum: Object.values(TicketTypes),
        default: 
    }