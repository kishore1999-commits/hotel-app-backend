import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: any;
        token: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: any;
        token: string;
    }>;
    getMe(userId: string): Promise<any>;
    logout(res: Response): Promise<{
        message: string;
    }>;
}
