export interface UserDto {
  id: number;
  name: string;
  login: string;
  avatar: string;
  hasTwoFactorAuthentication: boolean;
  status: string;
  nbrVictory: number;
  nbrLoss: number;
  latestTimeOnline: string;
  password: string;
  friends_id: number[];
  channels_id: number[];
  dms_id: number[];
  blocked_id: number[];
}
