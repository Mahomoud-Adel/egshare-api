import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username }
            ]
        });

        if (existingUser) {
            const field = existingUser.email === createUserDto.email ? 'Email' : 'Username';
            throw new ConflictException(`${field} already exists`);
        }


        const user = this.usersRepository.create({
            ...createUserDto,
        });

        await this.usersRepository.save(user);
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(identifier: string, password: string) {
        const user = await this.usersRepository.findOne({
            where: [
                { email: identifier },
                { username: identifier }
            ]
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
