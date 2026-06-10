import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto, QueryRoomDto } from './dto';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    softDelete(id: string): Promise<any>;
    checkAvailability(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean>;
}
