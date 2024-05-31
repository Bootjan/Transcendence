import React, { useContext, useEffect } from 'react';
import { OAuth42_access_token, OAuth42_user } from '../../OAuth42/login';
import { getUserByLogin, addUser, createNewUser, updateStatus } from "../../api/user/user.api";
import { useSearchParams, useNavigate } from 'react-router-dom'
import UserContext from '../../context/userContext';
import AuthContext from '../../context/authContext';
import { UserDto } from '../../api/user/dto/user.dto';
import styles from '../../css/auth.module.css';

const sleep: (ms: number) => Promise<void> = async (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const Redirection = () => {
	const [searchParams] = useSearchParams();
	const AUTH_CODE = searchParams.get('code');
	
	const { setUserId } = useContext(UserContext) || { setUserId: () => {} };
	const { setLoggedIn } = useContext(AuthContext) || { setLoggedIn: () => {} };
	const navigate = useNavigate();

	useEffect(() => {
  	const user42 = async () => {
		if (AUTH_CODE === null) {
			return;
		}
		const ACCESS_TOKEN = await OAuth42_access_token(AUTH_CODE);
		if (ACCESS_TOKEN === null) {
			return;
		}
		const user = await OAuth42_user(ACCESS_TOKEN);
		await sleep(2000);
		let userInDatabase: UserDto | null = await getUserByLogin(user.login);
		if (userInDatabase === null) {
			await addUser(createNewUser(user.name, user.login, user.avatar));
			await sleep(2000);
			let getId: UserDto | null = await getUserByLogin(user.login);
			if (getId === null) {
				navigate('/auth');
				return;
			}
			updateStatus(getId.id, "Online");
			setUserId(getId.id);
			setLoggedIn(1);
			navigate('/home');
		}
		else if (userInDatabase.hasTwoFactorAuthentication) {
			let getId: UserDto | null = await getUserByLogin(user.login);
			if (!getId) {
				navigate('/auth');
				return;
			}
			setUserId(getId.id);
			updateStatus(getId.id, "Online");
			navigate('/2fa');
		}
		else {
			let getId: UserDto | null = await getUserByLogin(user.login);
			if (!getId) {
				navigate('/auth');
				return;
			}
			setUserId(getId.id);
			setLoggedIn(1);
			updateStatus(getId.id, "Online");
			navigate('/home');
		}
  	}
  	user42();
  }, [AUTH_CODE, navigate, setUserId]);

  const handleClick = () => {
	const login = localStorage.getItem("loggedIn");
	if (login) {
		navigate('/home');
	}
	else {
		navigate('/');
	}
  };

  return (
  		<div className={styles.container}>
			<p>Redirecting to homepage...</p>
			<p style={{color: 'white'}}>
				Click <span onClick={handleClick} style={{ cursor: 'pointer', color: 'blue' }}>here</span> if you are not being redirected
			</p>
		</div>
		);
}

export default Redirection;
