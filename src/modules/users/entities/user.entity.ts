import { Exclude } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
    BeforeInsert,
    BeforeUpdate,
    OneToMany
} from "typeorm";
import * as bcrypt from 'bcrypt';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Follow } from './follow.entity';

@Entity('users') 
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ unique: true, length: 50 })
    username: string;

    @Index({ unique: true })
    @Column({ unique: true, length: 150 })
    email: string;

    @Column()
    fullName: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true, default: 'default-avatar.png' })
    profileImage: string;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    profileImagePublicId: string;

    @Column({ nullable: true })
    coverImage: string;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    coverImagePublicId: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Follow, (follow) => follow.following)
    followers: Follow[];

    @OneToMany(() => Follow, (follow) => follow.follower)
    following: Follow[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    
}