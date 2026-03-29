import { Exclude } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    OneToMany
} from "typeorm";
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    imagePublicId: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}