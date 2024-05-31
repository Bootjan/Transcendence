import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
	@PrimaryGeneratedColumn()
	match_id: number;
	
	@Column()
	id_player1: number;

	@Column()
	id_player2: number;

	@Column()
	score_player1: number;
	
	@Column()
	score_player2: number;

	@Column()
	is_custom_match: boolean;
}
