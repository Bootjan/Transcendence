import { ChannelDto } from "src/channels/models/channel.dto";
import { FriendDto } from "src/friends/models/friend.dto";

export interface UserDto {
  id: number;
  name: string;
  login: string;
  avatar: string;
  hasTwoFactorAuthentication: boolean;
  twoFactorAuthenticationSecret: string;
  status: string;
  nbrVictory: number;
  nbrLoss: number;
  latestTimeOnline: string
  password: string
  friends_id: number[]
  dms_id: number[]
  channels_id: number[]
}
