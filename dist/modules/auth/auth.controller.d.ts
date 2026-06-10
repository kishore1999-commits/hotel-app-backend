import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<{
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
    login(dto: LoginDto, res: Response): Promise<{
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
    logout(res: Response): Promise<{
        message: string;
    }>;
}
