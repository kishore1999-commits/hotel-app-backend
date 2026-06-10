import { CreateRoomDto } from './create-room.dto';
declare const UpdateRoomDto_base: import("@nestjs/common").Type<Partial<Omit<CreateRoomDto, "hotelId">>>;
export declare class UpdateRoomDto extends UpdateRoomDto_base {
}
export {};
