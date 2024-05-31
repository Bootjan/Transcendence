import React, { useState, useEffect, useContext } from 'react';
import * as OTPAuth from "otpauth";
import { useNavigate } from 'react-router';
import AuthContext from '../../context/authContext';
import cs from "../../css/base.module.css";


const TwoFactorAuth = () => {

	let [token, setToken] = useState<string>('');
	let [invalidToken, setInvalidToken] = useState<boolean>(false);

	const { setLoggedIn } = useContext(AuthContext) || { setLoggedIn: () => {} };
	const navigate = useNavigate();

	let totp = new OTPAuth.TOTP({
		label: "🤟",
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: "NB2W45DFOIZA",
	});

	const handleSubmit: () => void = async () => {
        let delta = totp.validate({ token, window: 1 });

		if (delta !== null && delta <= 1) {
			setInvalidToken(false);
			setLoggedIn(1);
			navigate('/home');
		} else {
			setInvalidToken(true);
		}
    };

	return (
		<div>
			<h1>Two Factor Authentication</h1>
			<br/>
			<input className={cs.textInput} type="number" placeholder='Code here...' required onChange={(e)=>setToken(e.target.value)}/> 
			<br/>

			{invalidToken && <br/>}
			{invalidToken && <p className={cs.errMsg}>Token is invalid!</p>}
			{invalidToken && <br/>}

			<br/>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	)
}

export default TwoFactorAuth;