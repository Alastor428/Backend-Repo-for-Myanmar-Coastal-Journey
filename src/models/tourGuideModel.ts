import mongoose from 'mongoose';

export enum TourGuideAvailability {
  Available = 'Available',
  Busy = 'Busy',
}

export enum TourGuideGender {
  Male = 'Male',
  Female = 'Female',

}

export interface ITourGuide {
  name: string;
  beach?: mongoose.Types.ObjectId;
  phone?: string;
  experienceYears?: number;
  gender?: TourGuideGender;
  languages: string[];
  pricePerDay: number;
  currency: string;
  availability: TourGuideAvailability;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const tourGuideSchema = new mongoose.Schema<ITourGuide>(
  {
    name: { type: String, required: true, trim: true },
    beach: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: false, index: true },
    phone: { type: String, trim: true },
    experienceYears: { type: Number, min: 0, default: 0 },
    gender: { type: String, enum: Object.values(TourGuideGender) },
    languages: { type: [String], default: [], index: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'MMK', trim: true },
    availability: {
      type: String,
      enum: Object.values(TourGuideAvailability),
      default: TourGuideAvailability.Available,
      index: true,
    },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const TourGuide = mongoose.model<ITourGuide>('TourGuide', tourGuideSchema);

