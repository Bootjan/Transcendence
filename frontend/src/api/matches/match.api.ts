import { API_ENDPOINT } from "../api_endpoint"
import axios, { Axios, AxiosResponse } from 'axios';
import { MatchDto } from "./dto/match.dto";
axios.defaults.baseURL = API_ENDPOINT;

export const getMatchesById: (id: number) => Promise<MatchDto[] | null> = async (id) => {
	try {
		void(0);
		const axiosResponse: AxiosResponse<any, any> = await axios.get(`/match/get/${id}`);
		if (axiosResponse.data === '') {
			return [];
		}
		return <MatchDto[]>axiosResponse.data;
	} catch (error) {
		void(0);
	}
	return null;
}