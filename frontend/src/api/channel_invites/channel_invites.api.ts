import axios, { AxiosResponse } from 'axios';
import { ChannelInviteDto } from './dto/channel_invite';
axios.defaults.baseURL = 'http://' + process.env.REACT_APP_BACKEND_HOST;

export const createChannelInvite: (id_player: number, login_player: string, id_channel: number, channel_name: string) => ChannelInviteDto = (id_player, login_player, id_channel, channel_name) => {
	let new_channel_invite: ChannelInviteDto = {
		id: 0,
		id_player: id_player,
		login_player: login_player,
		id_channel: id_channel,
		channel_name: channel_name,
	}
	return new_channel_invite;
}

export const getChannelInvitesById: (id_player: number) => Promise<ChannelInviteDto[] | null> = async (id_player) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`channel_invite/get_channel_invs/${id_player}`);
		if (axiosResponse.data === "") {
			return [];
		}
		return <ChannelInviteDto[]>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const sendChannelInvite: (id_player: number, login_player: string, id_channel: number, channel_name: string) => Promise<void> = async (id_player, login_player, id_channel, channel_name) => {
	try {
		const friendDto: ChannelInviteDto = createChannelInvite(id_player, login_player, id_channel, channel_name);
		await axios.post(`channel_invite/add`, friendDto);
	} catch (error) {
		void(0);
	}
}

export const getChannelInviteByIds: (id_player: number, id_channel: number) => Promise<ChannelInviteDto | null> = async (id_player, id_channel) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`channel_invite/get_one_inv/${id_player}/${id_channel}`);
		if (axiosResponse.data === "")
			return null;
		return <ChannelInviteDto>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const acceptChannelInvite: (id_player: number, id_channel: number) => Promise<void> = async (id_player, id_channel) => {
	// void(0);
	// void(0);
	try {
		await axios.delete(`channel_invite/accept/${id_player}/${id_channel}`);
	} catch (error) {
		void(0);
	}
}

export const rejectChannelInvite: (id_player: number, id_channel: number) => Promise<void> = async (id_player, id_channel) => {
	try {
		await axios.delete(`channel_invite/reject/${id_player}/${id_channel}`);
	} catch (error) {
		void(0);
	}
}
