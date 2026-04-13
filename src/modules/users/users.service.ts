import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto, uploadResult: any) {
        const { username, email, fullName, password, bio } = createUserDto;
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const user = this.usersRepository.create({
            username,
            email,
            fullName,
            password,
            bio,
            profileImage: uploadResult.secure_url,
            profileImagePublicId: uploadResult.public_id,
        });
        return this.usersRepository.save(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto, uploadResult: any) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        
        const { username, email, fullName, password, bio } = updateUserDto;
        
        // Validation for uniqueness
        if (email && email !== user.email) {
            const existingEmail = await this.usersRepository.findOne({ where: { email } });
            if (existingEmail) {
                throw new ConflictException('Email already exists');
            }
        }
        if (username && username !== user.username) {
            const existingUsername = await this.usersRepository.findOne({ where: { username } });
            if (existingUsername) {
                throw new ConflictException('Username already exists');
            }
        }

        // Apply changes directly to the existing user instance
        if (username) user.username = username;
        if (email) user.email = email;
        if (fullName) user.fullName = fullName;
        if (password) user.password = password;
        if (bio !== undefined) user.bio = bio;
        
        if (uploadResult) {
            user.profileImage = uploadResult.secure_url;
            user.profileImagePublicId = uploadResult.public_id;
        }

        return this.usersRepository.save(user);
    }

    async getUserProfile(username: string) {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateCoverImage(id: string, uploadResult: any) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.coverImage = uploadResult.secure_url;
        user.coverImagePublicId = uploadResult.public_id;
        return this.usersRepository.save(user);
    }
}
