import { FriendDto } from "src/friends/models/friend.dto";

export interface ChannelDto {
	id: number;
	admins_id: number[];
	members_id: number[];
	banned_id: number[];
	muted_id: number[];
	channel_name: string;
	is_private: boolean;
	requires_password: boolean;
	password: string;
}
