import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto, QueryHotelDto } from './dto';
export declare class HotelsController {
    private hotelsService;
    constructor(hotelsService: HotelsService);
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
    remove(id: string): Promise<any>;
}
