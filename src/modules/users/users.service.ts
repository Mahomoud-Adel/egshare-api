import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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
}
