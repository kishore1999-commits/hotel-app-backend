import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto, QueryRoomDto } from './dto';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryRoomDto): Promise<{
        data: ({
            hotel: {
                name: string;
                id: string;
                city: string;
            };
        } & {
            name: string;
            type: string;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            images: string[];
            amenities: string[];
            isActive: boolean;
            hotelId: string;
            pricePerNight: number;
            capacity: number;
            status: import(".prisma/client").$Enums.RoomStatus;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findByHotel(hotelId: string, query: QueryRoomDto): Promise<{
        data: ({
            hotel: {
                name: string;
                id: string;
                city: string;
            };
        } & {
            name: string;
            type: string;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            images: string[];
            amenities: string[];
            isActive: boolean;
            hotelId: string;
            pricePerNight: number;
            capacity: number;
            status: import(".prisma/client").$Enums.RoomStatus;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: string): Promise<{
        hotel: {
            name: string;
            description: string | null;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            city: string;
            country: string;
            starRating: number;
            images: string[];
            amenities: string[];
            checkInTime: string;
            checkOutTime: string;
            isActive: boolean;
        };
    } & {
        name: string;
        type: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        amenities: string[];
        isActive: boolean;
        hotelId: string;
        pricePerNight: number;
        capacity: number;
        status: import(".prisma/client").$Enums.RoomStatus;
    }>;
    create(dto: CreateRoomDto): Promise<{
        hotel: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        type: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        amenities: string[];
        isActive: boolean;
        hotelId: string;
        pricePerNight: number;
        capacity: number;
        status: import(".prisma/client").$Enums.RoomStatus;
    }>;
    update(id: string, dto: UpdateRoomDto): Promise<{
        hotel: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        type: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        amenities: string[];
        isActive: boolean;
        hotelId: string;
        pricePerNight: number;
        capacity: number;
        status: import(".prisma/client").$Enums.RoomStatus;
    }>;
    softDelete(id: string): Promise<{
        name: string;
        type: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        amenities: string[];
        isActive: boolean;
        hotelId: string;
        pricePerNight: number;
        capacity: number;
        status: import(".prisma/client").$Enums.RoomStatus;
    }>;
    checkAvailability(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean>;
}
