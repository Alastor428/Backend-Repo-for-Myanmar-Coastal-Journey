import mongoose, { Types } from "mongoose";

export enum seatStatus {
    Available = 'Available',
    Selected = 'Selected',
    Unavailable = 'Unavailable'
}
export interface IBusShow {
    bus: Types.ObjectId;
    ticket: Types.ObjectId;
    departureTime: string;
    price: number;
    seatLayout: {
        row: string;
        seats : {
            number: string;
            status: seatStatus;
            selectedBy?: Types.ObjectId;
        }[];
    }[];

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
    departureTime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seatLayout: [
  {
    row: {
      type: String,
      required: true
    },
    seats: [
      {
        number: {
          type: String,
          required: true
        },
        status: {
          type: String,
          enum: Object.values(seatStatus),
          default: seatStatus.Available
        },
        selectedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false,
        },
      }
    ]
  }
], 
   },
    { timestamps: true }
);

export const Show = mongoose.model('Show', busShowSchema);
