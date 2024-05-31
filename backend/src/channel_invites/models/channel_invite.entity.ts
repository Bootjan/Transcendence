import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChannelInvite {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	id_player: number;

	@Column()
	login_player: string;

	@Column()
	id_channel: number;

	@Column()
	channel_name: string;
}
