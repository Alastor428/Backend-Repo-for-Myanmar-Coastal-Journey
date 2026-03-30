import { Room, RoomTypes } from '../models/roomModel';
import type { CreateRoomInput, UpdateRoomInput } from '../validations/roomSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createRoomService = async (data: CreateRoomInput) => {
  const room = new Room({
    hotel: data.hotel,
    roomType: data.roomType,
    roomPricePerNight: data.roomPricePerNight,
    roomCapacity: data.roomCapacity,
    roomDescription: data.roomDescription,
  });
  return room.save();
};

export const getAllRoomsService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'roomType', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Room.find()
      .populate('hotel', 'hotelName beach')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Room.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRoomsByRoomTypeService = async (
  roomType: RoomTypes,
  pagination: PaginationQuery
) => {
  const { page, limit, sortBy = 'roomPricePerNight', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { roomType };

  const [data, total] = await Promise.all([
    Room.find(filter)
      .populate('hotel', 'hotelName beach')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Room.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRoomByIdService = async (id: string) => {
  const room = await Room.findById(id).populate('hotel', 'hotelName beach');
  if (!room) throw new Error('Invalid RoomId. Wrong Parameter Passed');
  return room;
};

export const updateRoomService = async (id: string, data: UpdateRoomInput) => {
  const room = await Room.findByIdAndUpdate(id, { $set: data }, { new: true }).populate(
    'hotel',
    'hotelName beach'
  );
  if (!room) throw new Error('Invalid RoomId. Wrong Parameter Passed');
  return room;
};

export const deleteRoomService = async (id: string) => {
  const room = await Room.findByIdAndDelete(id);
  if (!room) throw new Error('Invalid RoomId. Wrong Parameter Passed');
  return room;
};
