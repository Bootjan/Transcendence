import React, { useState, useEffect, useContext } from 'react';
import { UserDto } from '../../api/user/dto/user.dto';
import { getUserById } from "../../api/user/user.api";
import UserContext from '../../context/userContext';
import cs from "../../css/profile.module.css";
import styles from "../../css/base.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { MatchDto } from '../../api/matches/dto/match.dto';
import { getMatchesById } from '../../api/matches/match.api';
import IdChecker from './idChecker';

const FriendProfile = () => {
	const navigate = useNavigate();
	const { userId } = useContext(UserContext) || { userId: 0 };
	const location = useLocation();
	const friend_id = location.state && location.state.friend_id;
	const last_location = location.state && location.state.last_location;
	let [avatar, setAvatar] = useState<string>('');
	let [name, setName] = useState<string>('');
	const [login, setLogin] = useState<string>('');
	const [status, setStatus] = useState<string>('');
	let [nbrLoss, setNbrLoss] = useState<number>(0);
	let [nbrVictory, setNbrVictory] = useState<number>(0);
	let [history, setHistory] = useState<{match: MatchDto, opponent: UserDto}[]>([]);

	IdChecker();

	useEffect(() => {
	  const fetchUserData = async () => {
		try {
		  const data = await getUserById(friend_id);
		  if (data)
		  {
			setAvatar(data.avatar);
			setName(data.name);
			setLogin(data.login);
			setStatus(data.status);
			setNbrLoss(data.nbrLoss);
			setNbrVictory(data.nbrVictory);
		  }
		  const history = await getMatchesById(friend_id);
		  if (history)
		  {
				let history_with_opponents : {match: MatchDto, opponent: UserDto}[] = []
				for (let i = 0; i < history.length; i++) {
					let el : any = history[i]
					let opponent = await getUserById(el.match_id_player1 == friend_id ? el.match_id_player2 : el.match_id_player1);
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

	return (
		<div className={cs.container}>
			<div className={cs.wrapper}>
				<div className={cs.header}>
					<button className={cs.homeButton} onClick={()=>{ navigate(last_location) }}>Back</button>
				</div>
				<div className={cs.content}>
					<h1>Friends profile</h1>
					<img style={{ borderRadius: '50%' }} src={avatar || 'https://www.svgrepo.com/show/452117/tor.svg'} width="300" height="300"></img>
					<br/>
					<p>Name:</p>
					<p>{name}</p>
					<p>Login:</p>
					<p>{login}</p>
					<p>Status:</p>
					<p>{status}</p>
					<p>Total victories:</p>
					<p>{nbrVictory}</p>
					<p>Total losses:</p>
					<p>{nbrLoss}</p>
					<div>
						{history.length > 0 && <h1>History</h1>}
						<ul>
							{ history.map((el: any, index: number) => {
								if (el.match.match_id_player1 == userId) {
									return (
										<li>{name} {el.match.match_score_player1 > el.match.match_score_player2 ? "won" : "lost"} against {el.opponent.name} | {el.match.match_score_player1} - {el.match.match_score_player2}</li>
									);
								}
								else {
									return (
										<li>{name} {el.match.match_score_player2 > el.match.match_score_player1 ? "won" : "lost"} against {el.opponent.name} | {el.match.match_score_player2} - {el.match.match_score_player1}</li>
									);
								}
							})}
						</ul>
					</div>
					<br/>
				</div>
			</div>
		</div>
	);
};
export default FriendProfile;
