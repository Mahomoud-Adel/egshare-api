import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule
      .forRoot({
        isGlobal: true,
        load: [databaseConfig],
        envFilePath: '.env',
      }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database')!,
    }),
    UsersModule, PostsModule, CommentsModule, AuthModule, CloudinaryModule],
})
export class AppModule { }
