import { FriendDto } from "src/friends/models/friend.dto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    admins_id: number[];

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    members_id: number[];

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    banned_id: number[];

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    muted_id: number[];

	@Column()
	channel_name: string;

	@Column()
	is_private: boolean;

	@Column()
	requires_password: boolean;

	@Column()
	password: string;
}
