import { PaginationDto } from '../../../common/dto';
export declare class QueryHotelDto extends PaginationDto {
    search?: string;
    city?: string;
    country?: string;
    minRating?: number;
    amenity?: string;
}
