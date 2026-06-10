import { PrismaService } from '../../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto, QueryHotelDto } from './dto';
export declare class HotelsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryHotelDto): Promise<{
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
    create(dto: CreateHotelDto): Promise<any>;
    update(id: string, dto: UpdateHotelDto): Promise<any>;
    softDelete(id: string): Promise<any>;
}
