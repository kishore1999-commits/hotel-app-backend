import { RoomStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';
export declare class QueryRoomDto extends PaginationDto {
    hotelId?: string;
    type?: string;
    status?: RoomStatus;
    minPrice?: number;
    maxPrice?: number;
    minCapacity?: number;
}
