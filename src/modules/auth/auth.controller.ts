import { Body, Controller, Post, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post('register')
    @UseInterceptors(FileInterceptor('file'))
    async register(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        return this.authService.register(createUserDto, uploadResult);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.identifier, loginDto.password);
    }
}
