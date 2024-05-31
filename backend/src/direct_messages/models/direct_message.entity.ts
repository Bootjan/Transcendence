import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DirectMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	sender_id: number;

	@Column()
	receiver_id: number;

	@Column()
	message: string;

	@Column()
	game_id: number;

	@Column()
	is_invite: boolean;
}
