import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
//@Index(['name', 'type']): alt indexing when multiple are needed
@Entity()
export class Event{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    type: string;
    @Index()
    @Column()
    name: string;
    @Column('json')
    payload: Record<string, any>;
}