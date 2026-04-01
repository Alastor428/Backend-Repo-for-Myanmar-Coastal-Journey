import mongoose from 'mongoose';
import { Beach } from '../models/beachModel';
import { TourGuideBooking } from '../models/tourGuideBookingModel';
import { TourGuide, TourGuideAvailability } from '../models/tourGuideModel';
import type { PaginationQuery } from '../validations/commonSchema';
import type { CreateTourGuideInput, UpdateTourGuideInput } from '../validations/tourGuideSchema';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const createTourGuideService = async (data: CreateTourGuideInput) => {
  const guide = new TourGuide({
    name: data.name,
    beach: data.beach,
    phone: data.phone,
    experienceYears: data.experienceYears ?? 0,
    gender: data.gender,
    languages: data.languages ?? [],
    pricePerDay: data.pricePerDay,
    currency: data.currency ?? 'MMK',
    availability: data.availability ?? TourGuideAvailability.Available,
  });
  return guide.save();
};

export const getAllTourGuidesService = async (
  pagination: PaginationQuery,
  filters: {
    availableOnly?: boolean;
    beachId?: string;
    beachName?: string;
    gender?: string;
    language?: string;
    startDate?: Date;
    endDate?: Date;
  }
) => {
  const { page, limit, sortBy = 'createdAt', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const query: Record<string, unknown> = {};
  if (filters.availableOnly) query.availability = TourGuideAvailability.Available;

  const trimmedBeachName = filters.beachName?.trim();
  if (trimmedBeachName) {
    const beaches = await Beach.find({
      beachName: { $regex: escapeRegex(trimmedBeachName), $options: 'i' },
    })
      .select('_id')
      .lean();
    const beachIds = beaches.map((b) => b._id as mongoose.Types.ObjectId);
    if (beachIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
    query.beach = { $in: beachIds };
  } else if (filters.beachId) {
    query.beach = filters.beachId;
  }

  if (filters.gender) query.gender = filters.gender;
  if (filters.language) query.languages = filters.language;

  const [data, total] = await Promise.all([
    TourGuide.find(query)
      .populate('beach', 'beachName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    TourGuide.countDocuments(query),
  ]);

  if (filters.startDate && filters.endDate && data.length > 0) {
    const overlapping = await TourGuideBooking.find({
      status: { $in: ['Pending', 'Confirmed'] },
      startDate: { $lte: filters.endDate },
      endDate: { $gte: filters.startDate },
    })
      .select('tourGuide')
      .lean();
    const bookedIds = new Set(overlapping.map((b) => String(b.tourGuide)));

    for (const g of data) {
      const id = String(g._id);
      const bookedInRange = bookedIds.has(id);
      const profileBusy = g.availability === TourGuideAvailability.Busy;
      const withRange = g as typeof g & { rangeStatus: 'Available' | 'Busy' };
      withRange.rangeStatus =
        profileBusy || bookedInRange ? 'Busy' : 'Available';
    }
  }

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTourGuideByIdService = async (id: string) => {
  const guide = await TourGuide.findById(id).populate('beach', 'beachName');
  if (!guide) throw new Error('Invalid TourGuideId. Wrong Parameter Passed');
  return guide;
};

export const updateTourGuideService = async (id: string, data: UpdateTourGuideInput) => {
  const guide = await TourGuide.findByIdAndUpdate(id, { $set: data }, { new: true }).populate(
    'beach',
    'beachName'
  );
  if (!guide) throw new Error('Invalid TourGuideId. Wrong Parameter Passed');
  return guide;
};

export const deleteTourGuideService = async (id: string) => {
  const guide = await TourGuide.findByIdAndDelete(id);
  if (!guide) throw new Error('Invalid TourGuideId. Wrong Parameter Passed');
  return guide;
};

