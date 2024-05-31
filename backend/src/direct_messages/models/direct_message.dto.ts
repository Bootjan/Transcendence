export interface DirectMessageDto {
	id: number;
	sender_id: number;
	receiver_id: number;
	message: string;
	game_id: number;
	is_invite: boolean;
}
