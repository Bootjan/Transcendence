import { API_ENDPOINT } from "../api_endpoint";
import { FriendRequestDto } from "./dto/friend_request.dto"
import axios, { AxiosResponse } from 'axios';
axios.defaults.baseURL = API_ENDPOINT;

export const createFriendRequest: (id1: number, login1: string, id2: number, login2: string) => FriendRequestDto = (id1, login1, id2, login2) => {
	let new_friend_request: FriendRequestDto = {
		id: 0,
		id_player1: id1,
		login_player1: login1,
		id_player2: id2,
		login_player2: login2,
	}
	return new_friend_request;
}

export const getFriendRequestsById: (id: number) => Promise<FriendRequestDto[] | null> = async (id) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`friend/get_friend_reqs/${id}`);
		if (axiosResponse.data === "") {
			return [];
		}
		return <FriendRequestDto[]>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const sendFriendRequest: (id1: number, login1: string, id2: number, login2: string) => Promise<void> = async (id1, login1, id2, login2) => {
	try {
		const friendDto: FriendRequestDto = createFriendRequest(id1, login1, id2, login2);
		await axios.post(`friend/add`, friendDto);
	} catch (error) {
		void(0);
	}
}

export const getFriendRequestByIds: (id1: number, id2: number) => Promise<FriendRequestDto | null> = async (id1, id2) => {
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`friend/get_one_req/${id1}/${id2}`);
		if (axiosResponse.data === "")
			return null;
		return <FriendRequestDto>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}

export const acceptFriendRequest: (id1: number, id2: number) => Promise<void> = async (id1, id2) => {
	try {
		await axios.patch(`friend/accept/${id1}/${id2}`);
	} catch (error) {
		void(0);
	}
}

export const rejectFriendRequest: (id1: number, id2: number) => Promise<void> = async (id1, id2) => {
	try {
		void(0);
		void(0);
		await axios.delete(`friend/reject/${id1}/${id2}`);
	} catch (error) {
		void(0);
	}
}
