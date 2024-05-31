import React, { useContext, useEffect } from 'react';
import UserContext from '../../context/userContext';
import { getUserById } from '../../api/user/user.api';
import AuthContext from '../../context/authContext';
import { useNavigate } from 'react-router-dom';


const IdChecker = () => {
	const { userId, setUserId } = useContext(UserContext) || { userId: 0, setUserId: () => {} };
	const { setLoggedIn } = useContext(AuthContext) || { setLoggedIn: () => {} };
	const navigate = useNavigate();

	const idChecker = async () => {
		try {
			const id = await getUserById(userId);
			if (id == null) {
				setLoggedIn(0);
				setUserId(0);
				navigate('/');
				window.location.reload();
			}
		} catch (error) {
			setLoggedIn(0);
			setUserId(0);
			navigate('/');
			window.location.reload();
			console.log(error);
		}
	}
	useEffect(() => {
		const interval = setInterval(() => {
			idChecker();
		}, 200)
		return () => clearInterval(interval);
	}, [userId]);
}

export default IdChecker;
