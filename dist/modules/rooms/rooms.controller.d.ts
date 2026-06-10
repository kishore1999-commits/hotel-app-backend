import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto, QueryRoomDto, CheckAvailabilityDto } from './dto';
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    findAll(query: QueryRoomDto): Promise<{
        data: any;
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
        data: any;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: string): Promise<any>;
    create(dto: CreateRoomDto): Promise<any>;
    update(id: string, dto: UpdateRoomDto): Promise<any>;
    remove(id: string): Promise<any>;
    checkAvailability(dto: CheckAvailabilityDto): Promise<{
        available: boolean;
        roomId: string;
        checkIn: string;
        checkOut: string;
    }>;
}
