import mongoose, { Types } from 'mongoose';

export interface ITourGuideBooking {
  user: Types.ObjectId;
  tourGuide: Types.ObjectId;
  guestName?: string;
  status: 'Pending' | 'Confirmed';
  confirmedAt?: Date;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  pricePerDay: number;
  currency: string;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const tourGuideBookingSchema = new mongoose.Schema<ITourGuideBooking>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true, index: true },
    guestName: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed'],
      default: 'Pending',
      index: true,
    },
    confirmedAt: { type: Date, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true, min: 1 },
    pricePerDay: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'MMK', trim: true },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const TourGuideBooking = mongoose.model<ITourGuideBooking>(
  'TourGuideBooking',
  tourGuideBookingSchema
);

