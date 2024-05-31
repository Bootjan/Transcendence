import { API_ENDPOINT } from "../api_endpoint"
import { FriendDto } from "./dto/friend.dto";
import { CreateUserDto } from "./dto/create_user.dto"
import { UpdateUserDto } from "./dto/update_user.dto"
import { UserDto } from "./dto/user.dto"
import axios, { AxiosResponse } from 'axios';
import { ChannelDto } from "../channels/dto/channel.dto";
import { NameStatusDto } from "./dto/name_status.dto";
axios.defaults.baseURL = API_ENDPOINT;

export const createNewUser: (name: string, login: string, avatar: string, password?: string) => CreateUserDto = (name, login, avatar, password="") => {
  let createUserDto: CreateUserDto = {
    name: name,
    login: login,
    avatar: avatar,
    hasTwoFactorAuthentication: false,
    status: "Online",
    nbrVictory: 0,
    nbrLoss: 0,
    latestTimeOnline: Math.round(new Date().getTime() / 1000).toString(),
    password: password,
  	friends_id: [],
    channels_id: [],
    dms_id: [],
    blocked_id: [],
  }
  return createUserDto;
}

export const createUpdatedUser: (name: string, avatar: string, twoFactorAuth: boolean) => UpdateUserDto = (name, avatar, twoFactorAuth) => {
  let updateUserDto: UpdateUserDto = {
    name: name,
    avatar: avatar,
	hasTwoFactorAuthentication: twoFactorAuth
  }
  return updateUserDto;
}

export const updateStatus: (id: number, status: string) => void = async (id, status) => {
  try {
    await axios.patch(`/user/update_status/${id}/${status}`);
  } catch (error) {
    console.log(error);
  }
}

export const addUser: (createUserDto: CreateUserDto) => Promise<UserDto | null> = async (createUserDto) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.post('/user/add', createUserDto);
    if (axiosResponse.data === "")
      return null;
    return axiosResponse.data as UserDto;
  } catch (error) {
    void(0);
  }
  return null;
}

export const getAllUsers: () => Promise<UserDto[] | null> = async () => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get("/user");
    return axiosResponse.data as UserDto[];
  } catch (error) {
    void(0);
  }
  return null;
}

export const getUserById: (id: number) => Promise<UserDto | null> = async (id) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/id/${id}`);
    if (axiosResponse.data === "") {
		return null;
	}
    return axiosResponse.data as UserDto;
  } catch (error) {
    void(0);
  }
  return null;
}

export const getUserByName: (name: string) => Promise<UserDto | null> = async (name) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/name/${name}`);
    if (axiosResponse.data === "")
      return null;
    return axiosResponse.data as UserDto;
  } catch (error) {
    void(0);
  }
  return null;
}

export const getUserByLogin: (login: string) => Promise<UserDto | null> = async (login) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/login/${login}`);
    if (axiosResponse.data === "")
      return null;
    return axiosResponse.data as UserDto;
  } catch (error) {
    void(0);
  }
  return null;
}

export const getNameStatusById: (id: number) => Promise<NameStatusDto | null> = async (id) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/name_status/${id}`);
    if (axiosResponse.data === '') {
      return null;
    }
    return <NameStatusDto>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return null;
}

export const updateUser: (id: number, updateUserDto: UpdateUserDto) => void = async (id, updateUserDto) => {
  try {
    await axios.patch(`/user/${id}`, updateUserDto);
  } catch (error) {
    void(0);
  }
}

export const removeUser: (id: number) => void = async (id) => {
  await axios.delete(`/user/${id}`);
}

export const getTwoFactorAuthenticationSecret: () => Promise<any> = async () => {
  return (await axios.get('user/2fa/secret')).data;
}

export const verifyTwoFactorAuthentication: (secret: any, token: string) => Promise<boolean> = async (secret, token) => {
  return (await axios.post(`user/2fa/verify`, {
    secret: secret,
    token: token
  })).data;
}

export const userPasswordVerification: (id: number, password: string) => Promise<boolean> = async (id, password) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/password_verification/${id}/${password}`);
    if (axiosResponse.data === "")
      return false;
    return true;
  } catch (error) {
    void(0);
  }
  return false;
}

// MARK: Friends

export const addFriendByIds: (id1: number, id2: number) => Promise<void> = async (id1, id2) => {
  try {
    await axios.patch(`/user/add_friend/${id1}/${id2}`);
  } catch (error) {
    void(0);
  }
}

export const removeFriendByIds: (id1: number, id2: number) => Promise<void> = async (id1, id2) => {
  try {
    await axios.patch(`/user/remove_friend/${id1}/${id2}`);
  } catch (error) {
    void(0);
  }
}

export const getFriendsById: (id: number) => Promise<number[] | null> = async (id) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/get_friends/${id}`);
    if (axiosResponse.data === "")
      return [];
    return <number[]>axiosResponse.data;
  } catch(error) {
    void(0);
  }
  return null;
}

export const getFriendByIds: (id1: number, id2: number) => Promise<number> = async (id1, id2) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/get_friend/${id1}/${id2}`);
    if (axiosResponse.data === "")
      return 0;
    return <number>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return 0;
}

// MARK: Direct messages

export const createDirectMessageChat: (user1Dto: FriendDto, user2Dto: FriendDto) => Promise<void> = async (user1Dto, user2Dto) => {
  try {
    const requestBody = {
      dto1: user1Dto,
      dto2: user2Dto,
    }

    await axios.patch('/user/dm/create', requestBody);
  } catch (error) {
    void(0);
  }
}

export const getDirectMessageByIds: (id1: number, id2: number) => Promise<number> = async (id1, id2) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/dm/get_one/${id1}/${id2}`);
    if (axiosResponse.data === '') {
      return 0;
    }
    return <number>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return 0;
}

export const getDirectMessagesById: (id: number) => Promise<number[] | null> = async (id) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/dm/get_all/${id}`);
    if (axiosResponse.data === '')
      return null;
    return <number[]>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return null;
}

export const removeDirectMessage: (id1: number, id2: number) => Promise<number> = async (id1, id2) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.patch(`/user/dm/remove_dm/${id1}/${id2}`);
    if (axiosResponse.data === '') {
      return -1;
    }
    return <number>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return -1;
}

// MARK: Channels

export const addUserToChannel: (user_id: number, channelDto: ChannelDto) => Promise<void> = async (user_id, channelDto) => {
  try {
    await axios.patch(`/user/channels/add/${user_id}`, channelDto);
  } catch (error) {
    void(0);
  }
}

export const removeUserFromChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
  try {
    await axios.patch(`/user/channels/remove/${user_id}/${channel_id}`);
  } catch (error) {
    void(0);
  }
}

export const getChannelsById: (user_id: number) => Promise<number[] | null> = async (user_id) => {
  try {
    const axiosResponse: AxiosResponse<any, any> = await axios.get(`/user/channels/get_all/${user_id}`);
    if (axiosResponse.data === '') {
      return [];
    }
    return <number[]>axiosResponse.data;
  } catch (error) {
    void(0);
  }
  return null;
}

export const blockUserByIds: (userId: number, blockId: number) => Promise<void> = async (userId, blockId) => {
  try {
    await axios.patch(`user/block_user/${userId}/${blockId}`);
  } catch (error) {
    void(0);
  }
}

export const getBlockedUsersById: (id: number) => Promise<number[] | null> = async (id) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`user/get_blocked/${id}`);
		if (axiosResponse.data === "") {
			return [];
		}
		return <number[]>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

