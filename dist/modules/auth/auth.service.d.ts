import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: any;
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: any;
        token: string;
    }>;
    getMe(userId: string): Promise<any>;
    private generateToken;
}
