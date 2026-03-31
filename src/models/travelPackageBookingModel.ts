import mongoose, { Types } from 'mongoose';

export enum TravelPaymentMethod {
  Visa = 'VISA',
  MPU = 'MPU',
}

export interface ITravelPaymentReceipt {
  productDescription: string;
  invoiceNumber: string;
  amount: number;
  recipientMasked: string;
  transactionTime: Date;
  transactionNo: string;
  transactionTo: string;
  totalAmount: number;
  travelDate: Date;
  departureTime: string;
  purchaseSeat: string;
  paymentMethod: TravelPaymentMethod;
  nrcNumber?: string;
  userName: string;
}

export interface ITravelPackageBooking {
  user: Types.ObjectId;
  travelPackage: Types.ObjectId;
  numberOfPeople: number;
  currency: string;
  pricePerPerson: number;
  totalPrice: number;

  status: 'Pending' | 'Paid';
  paymentMethod?: TravelPaymentMethod;
  paidAt?: Date;
  receipt?: ITravelPaymentReceipt;

  createdAt?: Date;
  updatedAt?: Date;
}

const receiptSchema = new mongoose.Schema<ITravelPaymentReceipt>(
  {
    productDescription: { type: String, required: true },
    invoiceNumber: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    recipientMasked: { type: String, required: true },
    transactionTime: { type: Date, required: true },
    transactionNo: { type: String, required: true },
    transactionTo: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    travelDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    purchaseSeat: { type: String, required: true },
    paymentMethod: { type: String, enum: Object.values(TravelPaymentMethod), required: true },
    nrcNumber: { type: String },
    userName: { type: String, required: true },
  },
  { _id: false }
);

const travelPackageBookingSchema = new mongoose.Schema<ITravelPackageBooking>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    travelPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelPackage',
      required: true,
      index: true,
    },
    numberOfPeople: { type: Number, required: true, min: 1, default: 1 },
    currency: { type: String, default: 'MMK' },
    pricePerPerson: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending', index: true },
    paymentMethod: { type: String, enum: Object.values(TravelPaymentMethod) },
    paidAt: { type: Date, default: null },
    receipt: { type: receiptSchema, default: null },
  },
  { timestamps: true }
);

export const TravelPackageBooking = mongoose.model<ITravelPackageBooking>(
  'TravelPackageBooking',
  travelPackageBookingSchema
);

