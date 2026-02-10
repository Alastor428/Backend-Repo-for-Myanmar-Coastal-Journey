import mongoose from 'mongoose';

export enum TicketTypes {
    Local = 'Local',
    Foreigner = 'Foreigner'
}

export enum PassengerTypes {
    Group = 'Group',
    Male = 'Male',
    Female = 'Female'
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
    noOfAdult: {
        type: Number,
        default: 1,
        required: true
    },
    TicketType: {
        type: String,
        enum: Object.values(TicketTypes),
        default: TicketTypes.Local
    },
    PassengerType: {
        type: String,
        enum: Object.values(PassengerTypes),
        default: PassengerTypes.Male
    }
   },
   { timestamps: true },

);

export const Ticket = mongoose.model('Ticket', ticketSchema);