export interface ChannelMessageDto {
	id: number;
	sender_id: number;
	channel_id: number;
	message: string;
	is_invite: boolean;
	id_of_opponent: number;
}
