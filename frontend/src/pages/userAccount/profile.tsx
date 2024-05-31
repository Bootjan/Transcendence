import React, { useState, useEffect, useContext } from 'react';
import { UserDto } from '../../api/user/dto/user.dto';
import { createUpdatedUser, getUserById, getUserByLogin, getUserByName, updateUser } from "../../api/user/user.api";
import UserContext from '../../context/userContext';
import styles from "../../css/base.module.css";
import cs from "../../css/profile.module.css";
import { useNavigate } from 'react-router-dom';
import { MatchDto } from '../../api/matches/dto/match.dto';
import { getMatchesById } from '../../api/matches/match.api';
import QRcode from "qrcode";
import * as OTPAuth from "otpauth";
import IdChecker from './idChecker';

const Profile = () => {
	const navigate = useNavigate();
	const { userId } = useContext(UserContext) || { userId: 0 };

	let [avatar, setAvatar] = useState<string>('');
	let [name, setName] = useState<string>('');
	const [login, setLogin] = useState<string>('');
	let [nbrLoss, setNbrLoss] = useState<number>(0);
	let [nbrVictory, setNbrVictory] = useState<number>(0);
	let [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
	let [emptyName, setEmptyName] = useState<boolean>(false);
	let [nameAlreadyInUse, setNameAlreadyInUse] = useState<boolean>(false);
	let [failedToLoadPFP, setFailedToLoadPFP] = useState<boolean>(false);
	let [updatedSuccesfully, setUpdatedSuccesfully] = useState<boolean>(false);
	let [history, setHistory] = useState<{match: MatchDto, opponent: UserDto}[]>([]);
	let [image, setImage] = useState<string>();

	IdChecker();
	const Avatar: (event: any) => void = async (event) => {
		void(0);
		if (!event.target.files || event.target.files.length == 0) {
			setFailedToLoadPFP(true);
			return ;
		}
		let reader = new FileReader();
		 reader.onload = async (e) => {
			if (e === null || e!.target!.result === null || e!.target!.error !== null) {
				setFailedToLoadPFP(true);
				return ;
			}
			setAvatar(e!.target!.result as string);
		};
		if (event.target.files[0].size > 100000) {
			setFailedToLoadPFP(true);
			return ;
		}
		reader.readAsDataURL(event.target.files[0]);
	}

	let totp = new OTPAuth.TOTP({
		label: "🤟",
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: "NB2W45DFOIZA",
	});

	let uri = totp.toString();
	useEffect(() => {
        QRcode.toDataURL(uri)
            .then((url: any) => {
                setImage(url);
            })
            .catch((err: any) => {
                console.error(err)
            });
    }, []);

	useEffect(() => {
	  const fetchUserData = async () => {
		try {
		  const data = await getUserById(userId);
		  if (data)
		  {
			setAvatar(data.avatar);
			setName(data.name);
			setLogin(data.login);
			setNbrLoss(data.nbrLoss);
			setNbrVictory(data.nbrVictory);
			setTwoFactorAuth(data.hasTwoFactorAuthentication);
		  }
		  const history = await getMatchesById(userId);
		  if (history)
		  {
				let history_with_opponents : {match: MatchDto, opponent: UserDto}[] = []
				for (let i = 0; i < history.length; i++) {
					let el : any = history[i]
					let opponent = await getUserById(el.match_id_player1 == userId ? el.match_id_player2 : el.match_id_player1);
					if (opponent) {
						history_with_opponents.push({
							match: el,
							opponent: opponent
						})
					}
				};
				setHistory(history_with_opponents);
	      }
		} catch (error) {
		  console.error("Error fetching user data:", error);
		}
	};
	  fetchUserData();
	}, [userId]);

	const updateProfile: () => void = async () => {
		if (name === "") {
			void("Error: name is empty");
			setUpdatedSuccesfully(false);
			setNameAlreadyInUse(false);
			setEmptyName(true);
			return;
		}
		let userInDatabaseById: UserDto | null = await getUserById(userId);
		if (userInDatabaseById === null) {
			void(0);
			return;
		}
		let userInDatabaseByName: UserDto | null = await getUserByName(name);
		if (userInDatabaseByName !== null && userInDatabaseByName.id !== userId) {
			setName('');
			void("Error: name already in database");
			setUpdatedSuccesfully(false);
			setEmptyName(false);
			setNameAlreadyInUse(true);
			return;
		}
		await updateUser(userId, createUpdatedUser(name, avatar, twoFactorAuth));
		setUpdatedSuccesfully(true);
	}

	const toggleAuth = () => {
		setTwoFactorAuth(!twoFactorAuth);
	  };

	return (
		<div className={cs.container}>
			<div className={cs.wrapper}>
				<div className={cs.header}>
					<button className={cs.homeButton} onClick={()=>{ navigate('/home') }}>Home</button>
				</div>
				<div className={cs.content}>
					<h1>My profile</h1>
					<img style={{ borderRadius: '50%' }} src={avatar || 'https://www.svgrepo.com/show/452117/tor.svg'} width="300" height="300"></img>
					<br/><>
					<label className={cs.chooseFileButton}>Upload New Avatar <input className={cs.listButton} type="file" accept="image/*" onChange={ (e)=>Avatar(e) }/></label><br/></>
					<br/>
					<label>Name:</label><br/>
					<input className={cs.textBox} type="text" placeholder={name} maxLength={40} required onChange={(e)=>setName(e.target.value)}/> 
					<br/><br/>
					<p>Login:</p>
					<p>{login}</p>
					<p>Total victories:</p>
					<p>{nbrVictory}</p>
					<p>Total losses:</p>
					<p>{nbrLoss}</p>

					<p>Two factor authorization:</p>
					<button className={cs.submitButton} onClick={toggleAuth}>{twoFactorAuth ? 'Enabled' : 'Disabled'}</button>
					{twoFactorAuth && <h3>Scan QR Code with Google Authenticator app</h3>}
					{twoFactorAuth && <img style={{ width: '210px' }} src={image || 'https://www.svgrepo.com/show/518801/qr.svg '}></img>}
					{twoFactorAuth && <br/>}
					{twoFactorAuth && <br/>}

					<div>
						{ history.length > 0 && <h1>History</h1>}
						<ul>
							{ history.map((el: any, index: number) => {
								if (el.match.match_id_player1 == userId) {
									return (
										<li>You {el.match.match_score_player1 > el.match.match_score_player2 ? "won" : "lost"} against {el.opponent.name} | {el.match.match_score_player1} - {el.match.match_score_player2}{el.match.match_is_custom_match ? " | custom" : ""}</li>
									);
								}
								else {
									return (
										<li>You {el.match.match_score_player2 > el.match.match_score_player1 ? "won" : "lost"} against {el.opponent.name} | {el.match.match_score_player2} - {el.match.match_score_player1}{el.match.match_is_custom_match ? " | custom" : ""}</li>
									);
								}
							})}
						</ul>
					</div>
					<br/>

					{emptyName && <br/>}
					{emptyName && <p className={styles.errMsg}>Please fill in the name field!</p>}
					{emptyName && <br/>}

					{nameAlreadyInUse && <br/>}
					{nameAlreadyInUse && <p className={styles.errMsg}>Name already in use!</p>}
					{nameAlreadyInUse && <br/>}

					{failedToLoadPFP && <br/>}
					{failedToLoadPFP && <p className={styles.errMsg}>Failed to upload the profile picture!</p>}
					{failedToLoadPFP && <br/>}

					{updatedSuccesfully && <br/>}
					{updatedSuccesfully && <p className={styles.successMsg}>Account updated succesfully!</p>}
					{updatedSuccesfully && <br/>}
					<br/>
					<button className={cs.submitButton} type="submit" onClick={()=>{ updateProfile() }}>Save changes</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
