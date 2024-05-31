import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { FriendDto } from 'src/friends/models/friend.dto';
import { ChannelDto } from 'src/channels/models/channel.dto';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	login: string;

	@Column()
	avatar: string;

	@Column()
	hasTwoFactorAuthentication: boolean;

	@Column()
	status: string;
	
	@Column()
	nbrVictory: number;
	
	@Column()
	nbrLoss: number;
	
	@Column()
	latestTimeOnline: string
	
	@Column()
	password: string

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    friends_id: number[];

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    dms_id: number[];

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    channels_id: number[];

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,})
    blocked_id: number[];
}
