import { Beach } from '../models/beachModel';
import { Region } from '../models/regionModel';
import type { CreateRegionInput, CreateBeachInput, UpdateRegionInput, UpdateBeachInput } from '../validations/beachSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createRegionService = async (data: CreateRegionInput) => {
  const regionExists = await Region.findOne({ regionName: data.regionName });
  if (regionExists) throw new Error('Region Already Exist');

  const region = new Region({ regionName: data.regionName });
  return region.save();
};

export const createBeachService = async (data: CreateBeachInput) => {
  const beach = new Beach({
    beachName: data.beachName,
    region: data.region,
    currentSafe: data.currentSafe,
    imageUrl: data.imageUrl,
  });
  return beach.save();
};

export const getAllBeachesService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'beachName', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Beach.find()
      .populate('region', 'regionName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Beach.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBeachByIdService = async (id: string) => {
  const beach = await Beach.findById(id).populate('region', 'regionName');
  if (!beach) throw new Error('Invalid BeachId. Wrong Parameter Passed');
  return beach;
};

export const updateRegionService = async (id: string, data: UpdateRegionInput) => {
  const region = await Region.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!region) throw new Error('Invalid RegionId. Wrong Parameter Passed');
  return region;
};

export const deleteRegionService = async (id: string) => {
  const region = await Region.findByIdAndDelete(id);
  if (!region) throw new Error('Invalid RegionId. Wrong Parameter Passed');
  return region;
};

export const updateBeachService = async (id: string, data: UpdateBeachInput) => {
  const beach = await Beach.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate('region', 'regionName');
  if (!beach) throw new Error('Invalid BeachId. Wrong Parameter Passed');
  return beach;
};

export const deleteBeachService = async (id: string) => {
  const beach = await Beach.findByIdAndDelete(id);
  if (!beach) throw new Error('Invalid BeachId. Wrong Parameter Passed');
  return beach;
};
