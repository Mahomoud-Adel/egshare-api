import { Body, Controller, Get, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService
    ) { }
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: User) {
        return user;
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        return this.usersService.create(createUserDto, uploadResult);
    }

}
