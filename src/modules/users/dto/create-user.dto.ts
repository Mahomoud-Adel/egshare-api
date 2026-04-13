import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => value.trim().toLowerCase())
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(150)
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @IsNotEmpty()
    @IsString()
    // @Transform(({ value }) => value.trim())
    fullName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    bio?: string;
}
