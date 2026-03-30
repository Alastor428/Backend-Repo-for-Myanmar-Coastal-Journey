import mongoose from 'mongoose';

export enum RoomTypes {
  StandardDoubleOrTwin = 'Standard double or twin room',
}

export interface IRoom {
  hotel: mongoose.Types.ObjectId;
  roomType: RoomTypes;
  roomPricePerNight: number;
  roomCapacity: number;
  roomDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomType: {
      type: String,
      enum: Object.values(RoomTypes),
      default: RoomTypes.StandardDoubleOrTwin,
    },
    roomPricePerNight: {
      type: Number,
      required: true,
    },
    roomCapacity: {
      type: Number,
      required: true,
    },
    roomDescription: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>('Room', roomSchema);
