import mongoose, { Types } from 'mongoose';

export interface ITravelPackage {
  packageName: string;
  fromCity: Types.ObjectId;
  toBeach: Types.ObjectId;
  departOnDate: Date;
  departureTime: string;
  busTicket: {
    ticket: Types.ObjectId;
    pricePerPerson: number;
  };
  hotel: {
    hotel: Types.ObjectId;
    nights: number;
    feePerNightPerPerson: number;
  };
  transfers: {
    roundTripFeePerPerson: number;
  };

  currency: string;
  pricePerPerson: number;

  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function calcPricePerPerson(doc: Pick<ITravelPackage, 'busTicket' | 'hotel' | 'transfers'>): number {
  const bus = doc.busTicket.pricePerPerson;
  const hotel = doc.hotel.nights * doc.hotel.feePerNightPerPerson;
  const transfers = doc.transfers.roundTripFeePerPerson;
  return bus + hotel + transfers;
}

const travelPackageSchema = new mongoose.Schema<ITravelPackage>(
  {
    packageName: { type: String, required: true, trim: true },
    fromCity: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
    toBeach: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: true, index: true },
    departOnDate: { type: Date, required: true, index: true },
    departureTime: { type: String, required: true, trim: true },
    busTicket: {
      ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
      pricePerPerson: { type: Number, required: true, min: 0 },
    },
    hotel: {
      hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
      nights: { type: Number, required: true, min: 1 },
      feePerNightPerPerson: { type: Number, required: true, min: 0 },
    },
    transfers: {
      roundTripFeePerPerson: { type: Number, required: true, min: 0 },
    },
    currency: { type: String, default: 'MMK', trim: true },
    pricePerPerson: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

travelPackageSchema.pre('validate', function () {
  if (this.busTicket && this.hotel && this.transfers) {
    this.pricePerPerson = calcPricePerPerson(this);
  }
});

export const TravelPackage = mongoose.model<ITravelPackage>('TravelPackage', travelPackageSchema);

