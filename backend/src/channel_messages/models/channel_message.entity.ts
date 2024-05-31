import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChannelMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	sender_id: number;

	@Column()
	channel_id: number;

	@Column()
	message: string;

	@Column()
	is_invite: boolean;

	@Column()
	id_of_opponent: number;
	
	// @Column()
	// timestamp: number;
}
