import { RoomStatus } from '@prisma/client';
export declare class CreateRoomDto {
    hotelId: string;
    name: string;
    type: string;
    pricePerNight: number;
    capacity: number;
    images?: string[];
    amenities?: string[];
    status?: RoomStatus;
    isActive?: boolean;
}
