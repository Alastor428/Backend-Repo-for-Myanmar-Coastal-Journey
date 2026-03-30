import { Hotel } from '../models/hotelModel';
import type { CreateHotelInput, UpdateHotelInput } from '../validations/hotelSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createHotelService = async (data: CreateHotelInput) => {
  const hotel = new Hotel({
    hotelName: data.hotelName,
    beach: data.beach,
    hotelRating: data.hotelRating,
  });
  return hotel.save();
};

export const getAllHotelsService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'hotelName', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Hotel.find().populate('beach', 'beachName').sort(sort).skip(skip).limit(limit).lean(),
    Hotel.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getHotelsByBeachService = async (
  beachId: string,
  pagination: PaginationQuery
) => {
  const { page, limit, sortBy = 'hotelName', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  let filter = { beach: beachId };

  const [data, total] = await Promise.all([
    Hotel.find(filter)
      .populate('beach', 'beachName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Hotel.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getHotelByIdService = async (id: string) => {
  const hotel = await Hotel.findById(id).populate('beach', 'beachName');
  if (!hotel) throw new Error('Invalid HotelId. Wrong Parameter Passed');
  return hotel;
};

export const updateHotelService = async (id: string, data: UpdateHotelInput) => {
  const hotel = await Hotel.findByIdAndUpdate(id, { $set: data }, { new: true }).populate(
    'beach',
    'beachName'
  );
  if (!hotel) throw new Error('Invalid HotelId. Wrong Parameter Passed');
  return hotel;
};

export const deleteHotelService = async (id: string) => {
  const hotel = await Hotel.findByIdAndDelete(id);
  if (!hotel) throw new Error('Invalid HotelId. Wrong Parameter Passed');
  return hotel;
};
