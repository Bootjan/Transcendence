import axios, { AxiosResponse } from 'axios';

export const OAuth42_access_token: (AUTH_CODE: string) => Promise<any | null> = async (AUTH_CODE) => {
	const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
	const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
	const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

	const queryParams = "?"
	+ "grant_type=authorization_code&"
	+ "client_id=" + CLIENT_ID + "&"
	+ "client_secret=" + CLIENT_SECRET + "&"
	+ "code=" + AUTH_CODE + "&"
	+ "redirect_uri=" + REDIRECT_URI + "&"
	+ "scope=public";
	try {
		const axiosResponse: AxiosResponse<any, any> = await axios('https://api.intra.42.fr/oauth/token' + queryParams, {
																method: 'POST',
																headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
		return axiosResponse.data.access_token;
	} catch (error) {
		void(0);
	}
	return null;
}

export const OAuth42_user: (ACCESS_TOKEN: string) => Promise<{name: string, login: string, avatar: string}> = async(ACCESS_TOKEN) => {
	const axiosResponse: AxiosResponse<any, any> = await axios.get('https://api.intra.42.fr/v2/me', {
								headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
							});
	// void(JSON.stringify(axiosResponse.data));
	return ({
		name: <string>(axiosResponse.data.displayname),
		login: <string>(axiosResponse.data.login),
		avatar: <string>(axiosResponse.data.image.link)
	});
}
