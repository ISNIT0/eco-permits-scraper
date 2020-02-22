import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { Point } from 'geojson';

@Entity()
export class Entry extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') id: string
    @CreateDateColumn() createdAt: Date
    @UpdateDateColumn() updatedAt: Date

    // https://github.com/typeorm/typeorm/issues/2610
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326
    }) point: Point;

    @Column() type: string; // EntryType
    @Column() originalRecord: string;
    @Column({ unique: true }) itemUrl: string;
    @Column({ nullable: true }) summary?: string;
    @Column({ nullable: true }) description?: string;
    @Column({ nullable: true }) imageUrl?: string;

}
