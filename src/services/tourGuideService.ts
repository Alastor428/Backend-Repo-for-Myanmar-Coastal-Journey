import { TourGuide, TourGuideAvailability } from '../models/tourGuideModel';
import type { PaginationQuery } from '../validations/commonSchema';
import type { CreateTourGuideInput, UpdateTourGuideInput } from '../validations/tourGuideSchema';

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
    avatarUrl: data.avatarUrl,
  });
  return guide.save();
};

export const getAllTourGuidesService = async (
  pagination: PaginationQuery,
  filters: {
    availableOnly?: boolean;
    beachId?: string;
    gender?: string;
    language?: string;
  }
) => {
  const { page, limit, sortBy = 'createdAt', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const query: Record<string, unknown> = {};
  if (filters.availableOnly) query.availability = TourGuideAvailability.Available;
  if (filters.beachId) query.beach = filters.beachId;
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

