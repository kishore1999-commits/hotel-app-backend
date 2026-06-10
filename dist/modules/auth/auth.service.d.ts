import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            isPhoneVerified: boolean;
            avatar: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            isPhoneVerified: boolean;
            avatar: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getMe(userId: string): Promise<{
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        isPhoneVerified: boolean;
        avatar: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateToken;
}
