import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('profileImage'))
    async update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
        const uploadResult = file ? await this.cloudinaryService.uploadImage(file) : null;
        return this.usersService.update(user.id, updateUserDto, uploadResult);
    }

    @Patch('me/cover')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('coverImage'))
    async updateCoverImage(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
        const uploadResult = file ? await this.cloudinaryService.uploadImage(file) : null;
        return this.usersService.updateCoverImage(user.id, uploadResult);
    }

    @Get('profile/:username')
    @UseGuards(JwtAuthGuard)
    async getUserProfile(@Param('username') username: string) {
        return this.usersService.getUserProfile(username);
    }

    @Get('suggest')
    @UseGuards(JwtAuthGuard)
    async suggestUsers(@CurrentUser() user: User) {
        return this.usersService.suggestUsers(user.id);
    }

}
