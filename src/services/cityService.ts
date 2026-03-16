import { City } from '../models/cityModel';
import type { CreateCityInput } from '../validations/citySchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createCityService = async (data: CreateCityInput) => {
  const city = new City({ cityName: data.cityName });
  return city.save();
};

export const getAllCitiesService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'cityName', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    City.find().sort(sort).skip(skip).limit(limit).lean(),
    City.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getCityByIdService = async (id: string) => {
  const city = await City.findById(id);
  if (!city) throw new Error('Invalid CityId. Wrong Parameter Passed');
  return city;
};

export const updateCityService = async (id: string, data: { cityName: string }) => {
  const city = await City.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!city) throw new Error('Invalid CityId. Wrong Parameter Passed');
  return city;
};

export const deleteCityService = async (id: string) => {
  const city = await City.findByIdAndDelete(id);
  if (!city) throw new Error('Invalid CityId. Wrong Parameter Passed');
  return city;
};
