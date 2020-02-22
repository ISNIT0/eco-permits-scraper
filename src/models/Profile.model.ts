import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') id: string
    @CreateDateColumn() createdAt: Date
    @UpdateDateColumn() updatedAt: Date

    @Column() name: string;
    @Column({ unique: true, nullable: true }) email: string;
    @Column({ unique: true }) phoneNumber: string;
}
