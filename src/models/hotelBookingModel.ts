import mongoose, { Types } from 'mongoose';

export interface IHotelBookingLineItem {
  room: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  /** e.g. "after 14:00" */
  checkInTimeNote: string;
  /** e.g. "Before 12:00" */
  checkOutTimeNote: string;
  numberOfRooms: number;
  numberOfAdults: number;
  lengthOfStayNights: number;
  lineTotalPrice: number;
}

export interface IHotelBooking {
  user: Types.ObjectId;
  hotel: Types.ObjectId;
  guestName: string;
  status: 'Pending' | 'Confirmed';
  confirmedAt?: Date;
  taxIncluded: boolean;
  currency: string;
  lineItems: IHotelBookingLineItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const lineItemSchema = new mongoose.Schema<IHotelBookingLineItem>(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: { 
      type: Date, 
      required: true 
    },
    checkOutDate: { 
      type: Date, 
      required: true 
    },
    checkInTimeNote: { 
      type: String, 
      default: 'after 14:00' 
    },
    checkOutTimeNote: { 
      type: String, 
      default: 'Before 12:00' 
    },
    numberOfRooms: { 
      type: Number, 
      required: true 
    },
    numberOfAdults: { 
      type: Number, 
      required: true 
    },
    lengthOfStayNights: { 
      type: Number, 
      required: true },
    lineTotalPrice: { 
      type: Number, 
      required: true, 
      min: 0 },
  },
  { _id: true }
);

const hotelBookingSchema = new mongoose.Schema<IHotelBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed'],
      default: 'Pending',
      index: true,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    taxIncluded: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: 'MMK',
    },
    lineItems: {
      type: [lineItemSchema],
      validate: [(v: unknown[]) => Array.isArray(v) && v.length > 0, 'At least one line item'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export const HotelBooking = mongoose.model<IHotelBooking>('HotelBooking', hotelBookingSchema);
