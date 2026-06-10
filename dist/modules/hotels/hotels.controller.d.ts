import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto, QueryHotelDto } from './dto';
export declare class HotelsController {
    private hotelsService;
    constructor(hotelsService: HotelsService);
    findAll(query: QueryHotelDto): Promise<{
        data: ({
            _count: {
                reviews: number;
                rooms: number;
            };
        } & {
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
        _count: {
            bookings: number;
            reviews: number;
        };
        rooms: {
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
        }[];
    } & {
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
    }>;
    create(dto: CreateHotelDto): Promise<{
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
    }>;
    update(id: string, dto: UpdateHotelDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
