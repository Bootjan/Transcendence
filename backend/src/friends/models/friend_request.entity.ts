import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendRequest {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	id_player1: number;

	@Column()
	login_player1: string;

	@Column()
	id_player2: number;

	@Column()
	login_player2: string;
}
