import { ReactNode, useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { addFriendByIds, blockUserByIds, getBlockedUsersById, getFriendByIds, getFriendsById, getNameStatusById, getUserById, getUserByLogin, removeFriendByIds } from "../../api/user/user.api";
import { UserDto } from "../../api/user/dto/user.dto";
import { FriendDto } from "../../api/user/dto/friend.dto";
import { acceptFriendRequest, getFriendRequestByIds, getFriendRequestsById, rejectFriendRequest, sendFriendRequest } from "../../api/friends/friend.api";
import { get } from "http";
import styles from "../../css/profile.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FriendRequestDto } from "../../api/friends/dto/friend_request.dto";
import { NameStatusDto } from "../../api/user/dto/name_status.dto";
import IdChecker from "../userAccount/idChecker";
import cs from '../../css/friends.module.css';

export const Friends = () => {
	const { userId } = useContext(UserContext) || { userId: 0 };
	const navigate = useNavigate();
	const location = useLocation();

	const [userData, setUserData] = useState<UserDto | null>(null);
	const [friends, setFriends] = useState<FriendDto[] | null>(null);
	const [nameStatus, setNameStatus] = useState<NameStatusDto[]>([]);
	const [friendRequests, setFriendRequests] = useState<FriendRequestDto[]>([]);
	const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
	let [friendName, setFriendName] = useState<string>('');

	let [emptyName, setEmptyName] = useState<boolean>(false);
	let [nameIsUser, setNameIsUser] = useState<boolean>(false);
	let [userIsBlocked, setUserIsBlocked] = useState<boolean>(false);
	let [friendRequestAlreadySend, setFriendRequestAlreadySend] = useState<boolean>(false);
	let [nameNotFound, setNameNotFound] = useState<boolean>(false);
	let [requestSendSuccesfully, setRequestSendSuccesfully] = useState<boolean>(false);

	IdChecker();
	
	useEffect(() => {
		const fetchUserData: () => Promise<[number[] | null, number[] | null]> = async () => {
			try {
				const user_data: UserDto | null = await getUserById(userId);
				if (!user_data) {
					void("Error: user_data was null");
					return [null, null];
				}
				setUserData(user_data);
				const friends: number[] | null = await getFriendsById(userId);
				if (!friends) {
					void("Error: friends was null");
					return [null, null];
				}
				let friendsArray: UserDto[] = [];
				for (const el of friends) {
					const friend: UserDto | null = await getUserById(el);
					if (friend) {
						friendsArray.push(friend);
					}
				}
				setFriends(friendsArray);
				const friend_requests: FriendRequestDto[] | null = await getFriendRequestsById(userId);
				if (!friend_requests) {
					void("Error: friend_requests was null");
					return [null, null];
				}
				setFriendRequests(friend_requests);
				const blockedUsers: number[] | null = await getBlockedUsersById(userId);
				if (!blockedUsers) {
					console.log("Error: blockedUsers was null");
					return [null, null];
				}
				setBlockedUsers(blockedUsers);
				return [friends, blockedUsers];
			} catch (error) {
				console.log(error);
			}
			return [null, null];
		}
		const fetchRequests: (friends: number[], blockedUsers: number[]) => Promise<void> = async (friends, blockedUsers) => {
			try {
				let name_status_array: NameStatusDto[] = [];
				for (const el of friends) {
					const nameStatusDto: NameStatusDto | null = await getNameStatusById(el);
					if (nameStatusDto && arrayContains(blockedUsers, el) === false) {
						name_status_array.push(nameStatusDto);
					}
					void(0);

				}
				setNameStatus(name_status_array);
			} catch (error) {
				void(0);
			}
		}
		const interval = setInterval(() => {
			fetchUserData()
			.then((array: [number[] | null, number[] | null]) => {
				if (array[0] && array[1]) {
					fetchRequests(array[0], array[1]).catch((error) => {console.log(error);});
				}
			})
			.catch((error) => {console.log(error)});
		}, 500)
	   
		return () => clearInterval(interval);
	}, [userId]);

	const arrayContains: (array: number[], needle: number) => boolean = (array, needle) => {
		for (const el of array) {
			if (needle == el) {
				return true;
			}
		}
		return false;
	}

	const addUser: () => void = async () => {
		setNameIsUser(false);
		setNameNotFound(false);
		setFriendRequestAlreadySend(false);
		setRequestSendSuccesfully(false);
		setUserIsBlocked(false);
		setEmptyName(false);
		if (!userData) {
			void("Error: userData was undefined");
			return;
		}
		if (friendName === ""){
			void("Error: name is empty");
			setEmptyName(true);
			return;
		}
		if (friendName === userData?.login) {
			void("Error: name is user");
			setNameIsUser(true);
			return;
		}
		const getFriendFromDatabase: UserDto | null = await getUserByLogin(friendName);
		if (getFriendFromDatabase === null) {
			setNameNotFound(true);
			return;
		}
		console.log(blockedUsers);
		console.log(getFriendFromDatabase);
		if (arrayContains(blockedUsers, getFriendFromDatabase.id) === true) {
			setUserIsBlocked(true);
			return;
		}
		const getFriendRequest: FriendRequestDto | null = await getFriendRequestByIds(userId, getFriendFromDatabase.id);
		const getFriend: number | null = await getFriendByIds(userId, getFriendFromDatabase.id);
		if (getFriendRequest || getFriend) {
			void("Error: friend request already send or already friends");
			setFriendRequestAlreadySend(true);
			return;
		}
		await sendFriendRequest(userData.id, userData.login, getFriendFromDatabase.id, getFriendFromDatabase.login);
		setRequestSendSuccesfully(true);
	}

	const acceptRequest: (friendId: number) => void = async (friendId) => {
		await acceptFriendRequest(userId, friendId);
		await addFriendByIds(userId, friendId);
	}

	const rejectRequest: (friendId: number) => void = async (friendId) => {
		await rejectFriendRequest(userId, friendId);
	}

	const removeFriend: (friendId: number) => void = async (friendId) => {
		await removeFriendByIds(userId, friendId);
	}
	
	const blockFriend: (friendId: number) => void = async (friendId) => {
		await removeFriendByIds(userId, friendId);
		await blockUserByIds(userId, friendId);
	}

	const checkOutProfile: (id: number) => void = async (id) => {
		navigate('/friend_profile', {state: {friend_id: id, last_location: location.pathname}});
	}

	return (
		<div className={cs.container}>
			<div className={cs.wrapper}>
				<div className={cs.header}>
					<button className={cs.homeButton} onClick={()=>{ navigate('/home') }}>Home</button>
				</div>
				<div className={cs.content}>
					<div>
						<h1>Friends</h1>
						<ul>
							{ nameStatus.length === 0 && <li>No friend yet! Try making some</li>}
							{ nameStatus.map((el: NameStatusDto) => {
								return (
									<li>{el.name}	Status: {el.status}
										<button className={cs.listButton} onClick={()=>{ checkOutProfile(el.id) }}>Profile</button>
										<button className={cs.listButton} type="submit" onClick={()=>{ removeFriend(el.id) }}>Remove</button>
										<button className={cs.listButton} type="submit" onClick={()=>{ blockFriend(el.id) }}>Block</button>
									</li>);
							})}
						</ul><br/>
					</div>
					<div>
						{ friendRequests.length > 0 && <h1>Friend requests</h1>}
						<ul>
							{ friendRequests.map((el: any) => {
								return (
								<li>{el.FriendRequest_login_player1}
									<button className={cs.listButton} type="submit" onClick={()=>{ acceptRequest(el.FriendRequest_id_player1) }}>Accept</button>
									<button className={cs.listButton} type="submit" onClick={()=>{ rejectRequest(el.FriendRequest_id_player1) }}>Reject</button>
								</li>)
							})}
						</ul>
					</div>
					<div>
						<h1>Send friend request</h1>
						<input className={cs.textBox} type="text" placeholder={'Name of friend'} maxLength={40} required onChange={(e)=>setFriendName(e.target.value)}/> 
						<br/><br/>

						{emptyName && <br/>}
						{emptyName && <p className={styles.errMsg}>Please fill in the name field!</p>}
						{emptyName && <br/>}

						{nameIsUser && <br/>}
						{nameIsUser && <p className={styles.errMsg}>Can't enter your own username!</p>}
						{nameIsUser && <br/>}

						{friendRequestAlreadySend && <br/>}
						{friendRequestAlreadySend && <p className={styles.errMsg}>You already send a friend request to or are already friends with this person!</p>}
						{friendRequestAlreadySend && <br/>}

						{nameNotFound && <br/>}
						{nameNotFound && <p className={styles.errMsg}>User wasn't found!</p>}
						{nameNotFound && <br/>}

						{userIsBlocked && <br/>}
						{userIsBlocked && <p className={styles.errMsg}>You blocked this user!</p>}
						{userIsBlocked && <br/>}

						{requestSendSuccesfully && <br/>}
						{requestSendSuccesfully && <p className={styles.successMsg}>Friend request send succesfully!</p>}
						{requestSendSuccesfully && <br/>}

						<button className={cs.submitButton} type="submit" onClick={()=>{ addUser() }}>Send friend request</button>
					</div>
				</div>
			</div>
		</div>
	);
}
