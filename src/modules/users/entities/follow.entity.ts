import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('follows')
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followingId' })
    following: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
