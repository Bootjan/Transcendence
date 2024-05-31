import { API_ENDPOINT } from "../api_endpoint"
import axios, { Axios, AxiosResponse } from 'axios';
import { ChannelDto } from "./dto/channel.dto";
import { FriendDto } from "../user/dto/friend.dto";
axios.defaults.baseURL = API_ENDPOINT;

export const createNewChannelDto: (admin_id: number, channel_name: string, is_private: boolean, requires_password: boolean, password: string) => ChannelDto = (admin_id, channel_name, is_private, requires_password, password) => {
	let new_channel: ChannelDto = {
		id: -1,
		admins_id: [admin_id],
		members_id: [],
		banned_id: [],
		muted_id: [],
		channel_name: channel_name,
		is_private: is_private,
		requires_password: requires_password,
		password: password,
	};
	return new_channel;
}

export const createNewChannel: (channelDto: ChannelDto) => Promise<ChannelDto | null> = async (channelDto) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.post('/channel/create', channelDto);
		if (axiosResponse.data === '') {
			return null;
		}
		return <ChannelDto>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const getChannelByName: (channel_name: string) => Promise<ChannelDto | null> = async (channel_name) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`channel/get_by_name/${channel_name}`);
		if (axiosResponse.data === '') {
			return null;
		}
		return <ChannelDto>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const getChannelById: (channel_id: number) => Promise<ChannelDto | null> = async (channel_id) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`channel/get_by_id/${channel_id}`);
		if (axiosResponse.data === '') {
			return null;
		}
		return <ChannelDto>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const removeChannelById: (channel_id: number) => Promise<void> = async (channel_id) => {
	try {
		await axios.delete(`channel/remove/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const removeAdminFromChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
	try {
		await axios.patch(`channel/remove_admin/${user_id}/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const addAdminToChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
	try {
		await axios.patch(`channel/add_admin/${user_id}/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const removeMemberFromChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
	try {
		await axios.patch(`channel/remove_member/${user_id}/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const addMemberToChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
	try {
		await axios.patch(`channel/add_member/${user_id}/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const banPlayerFromChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
	try {
		await axios.patch(`channel/ban_player/${user_id}/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const mutePlayerFromChannel: (user_id: number, channel_id: number) => Promise<void> = async (user_id, channel_id) => {
	try {
		await axios.patch(`channel/mute_player/${user_id}/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const makeChannelPublicPrivate: (channel_id: number, private_public: boolean) => Promise<void> = async (channel_id, private_public) => {
	try {
		await axios.patch(`channel/private_public/${channel_id}/${private_public}`);
	} catch (error) {
		void(0);
	}
}

export const removePasswordFromChannel: (channel_id: number) => Promise<void> = async (channel_id) => {
	try {
		await axios.patch(`channel/remove_pass/${channel_id}`);
	} catch (error) {
		void(0);
	}
}

export const addPasswordToChannel: (channel_id: number, password: string) => Promise<void> = async (channel_id, password) => {
	try {
		await axios.patch(`channel/add_pass/${channel_id}/${password}`);
	} catch (error) {
		void(0);
	}
}

export const verifyChannelPassword: (channel_id: number, password: string) => Promise<boolean> = async (channel_id, password) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`channel/verify/${channel_id}/${password}`);
		if (axiosResponse.data === '') {
			return false;
		}
		return <boolean>axiosResponse.data;
	} catch (error) {
		console.log(error);
	}
	return false;
}