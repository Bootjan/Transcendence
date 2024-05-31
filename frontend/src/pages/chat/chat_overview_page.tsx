import { ReactNode, useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { UserDto } from "../../api/user/dto/user.dto";
import bcrypt from 'bcryptjs'
import styles from "../../css/profile.module.css";
import { useNavigate } from "react-router-dom";
import { FriendDto } from "../../api/user/dto/friend.dto";
import { addUserToChannel, blockUserByIds, createDirectMessageChat, getBlockedUsersById, getChannelsById, getDirectMessageByIds, getDirectMessagesById, getNameStatusById, getUserById, getUserByLogin, removeDirectMessage, removeFriendByIds, removeUserFromChannel } from "../../api/user/user.api";
import { deleteMessagesByIds } from "../../api/direct_messages/direct_messages.api";
import { ChannelDto } from "../../api/channels/dto/channel.dto";
import { addAdminToChannel, addMemberToChannel, createNewChannel, createNewChannelDto, getChannelById, getChannelByName, removeAdminFromChannel, removeChannelById, removeMemberFromChannel, verifyChannelPassword } from "../../api/channels/channels.api";
import { ChannelInviteDto } from "../../api/channel_invites/dto/channel_invite";
import { acceptChannelInvite, getChannelInvitesById, rejectChannelInvite } from "../../api/channel_invites/channel_invites.api";
import { NameStatusDto } from "../../api/user/dto/name_status.dto";
import cs from "../../css/chat.module.css";
import _ from 'underscore';
import IdChecker from "../userAccount/idChecker";

export const ChatOverviewPage = () => {
	const { userId } = useContext(UserContext) || { userId: 0 };
	const navigate = useNavigate();

	// MARK: useStates
	const [userData, setUserData] = useState<UserDto | null>(null);
	let [dms, setDms] = useState<number[]>([]);
	let [channels, setChannels] = useState<ChannelDto[]>([]);
	let [channelInvites, setChannelInvites] = useState<ChannelInviteDto[]>([]);
	let [nameStatus, setNameStatus] = useState<NameStatusDto[]>([]);
	let [blockedUsers, setBlockedUsers] = useState<number[]>([]);
	
	let [friendName, setFriendName] = useState<string>('');
	let [emptyName, setEmptyName] = useState<boolean>(false);
	let [isUser, setIsUser] = useState<boolean>(false);
	let [userDoesntExist, setUserDoesntExist] = useState<boolean>(false);
	let [chatAlreadyExists, setChatAlreadyExists] = useState<boolean>(false);
	let [userIsBlockedDm, setUserIsBlockedDm] = useState<boolean>(false);
	// let [userIsBlockedChat, setUserIsBlockedChat] = useState<boolean>(false);

	let [requirePassword, setRequirePassword] = useState<boolean>(false);
	let [privateChannel, setPrivateChannel] = useState<boolean>(false);
	let [channelName, setChannelName] = useState<string>('');
	let [channelNameToJoin, setChannelNameToJoin] = useState<string>('');
	let [channelPassword, setChannelPassword] = useState<string>('');

	let [emptyChannelName, setEmptyChannelName] = useState<boolean>(false);
	let [channelNameAlreadyTaken, setChannelNameAlreadyTaken] = useState<boolean>(false);
	let [emptyChannelPassword, setEmptyChannelPassword] = useState<boolean>(false);
	let [privateOrPassword, setPrivateOrPassword] = useState<boolean>(false);

	let [channelToJoinNotFound, setChannelToJoinNotFound] = useState<boolean>(false);
	let [channelIsPrivate, setChannelIsPrivate] = useState<boolean>(false);
	let [emptyPassword, setEmptyPassword] = useState<boolean>(false);
	let [wrongPassword, setWrongPassword] = useState<boolean>(false);
	let [emptyChannelNameToJoin, setEmptyChannelNameToJoin] = useState<boolean>(false);
	let [userAlreadyInChannel, setUserAlreadyInChannel] = useState<boolean>(false);
	let [userIsBanned, setUserIsBanned] = useState<boolean>(false);

	IdChecker();
	
	// MARK: useEffect
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const user_data: UserDto | null = await getUserById(userId);
				if (!user_data) {
					void("Error: user_data was null");
					return;
				}
				setUserData(user_data);
			} catch (error) {
				void(0);
			}
		}
		const fetchDmData = async () => {
			const dms: number[] | null = await getDirectMessagesById(userId);
			if (!dms) {
				void("Error: dms was null");
				return;
			}
			setDms(dms);
			let name_status_array: NameStatusDto[] = [];
			for (const el of dms) {
				const nameStatusDto: NameStatusDto | null = await getNameStatusById(el);
				if (nameStatusDto) {
					name_status_array.push(nameStatusDto);
				}
			}
			setNameStatus(name_status_array);
			const blockedUsers: number[] | null = await getBlockedUsersById(userId);
			if (!blockedUsers) {
				void("Error: blockedUsers was null");
				return;
			}
			setBlockedUsers(blockedUsers);
		}
		const fetchChannelData = async () => {
			try {
				const channels: number[] | null = await getChannelsById(userId);
				if (!channels) {
					void("Error: channels was null");
					return;
				}
				let channelsInfo: ChannelDto[] = [];
				for (const el of channels) {
					let channelInfo: ChannelDto | null = await getChannelById(el);
					if (channelInfo) {
						channelsInfo.push(channelInfo);
					} else {
						removeUserFromChannel(userId, el);
					}
				}
				setChannels(channelsInfo);
				const channel_invites: ChannelInviteDto[] | null = await getChannelInvitesById(userId);
				if (!channel_invites) {
					void("Error: channel_invites was null");
					return;
				}
				setChannelInvites(channel_invites);
			} catch (error) {
				void(0);
			}
		}
		const interval = setInterval(() => {
			fetchUserData().catch((error: any) => {void(0);});
			fetchDmData().catch((error: any) => {void(0);})
			fetchChannelData().catch((error: any) => {void(0);});
		}, 200)
		return () => clearInterval(interval);
	}, [userId]);

	// MARK: DMs
	const startChat: () => void = async () => {
		setEmptyName(false);
		setUserDoesntExist(false);
		setChatAlreadyExists(false);
		setIsUser(false);
		setUserIsBlockedDm(false);
		if (userData === null) {
			void("Error: userData is null");
			return;
		}
		if (friendName === '') {
			setEmptyName(true);
			return;
		}
		if (friendName === userData.login) {
			setIsUser(true);
			return;
		}
		const friend: UserDto | null = await getUserByLogin(friendName);
		if (!friend) {
			setUserDoesntExist(true);
			return;
		}
		if (arrayContains(blockedUsers, friend.id) === true) {
			setUserIsBlockedDm(true);
			return;
		}
		const chat: number | null = await getDirectMessageByIds(userId, friend.id);
		if (chat !== 0) {
			setChatAlreadyExists(true);
			return;
		}
		const friendDto1: FriendDto = {
			id: userId,
			login: userData.login,
		}
		const friendDto2: FriendDto = {
			id: friend.id,
			login: friend.login,
		}
		await createDirectMessageChat(friendDto1, friendDto2);
		window.location.reload();
	}

	const removeDm: (friendId: number) => void = async (friendId) => {
		try {
			await removeDirectMessage(userId, friendId);
			await removeDirectMessage(friendId, userId);
			await deleteMessagesByIds(userId, friendId);
		} catch (error) {
			void(0);
		}
		window.location.reload();
	}

	const enterDm: (id: number) => void = async (id) => {
		navigate('/dm', {state: {friendId: id}});
	}

	// MARK: Create Channel
	const createChannel: () => void = async () => {
		setEmptyChannelPassword(false);
		setChannelNameAlreadyTaken(false);
		setEmptyChannelName(false);
		setPrivateOrPassword(false);
		if (userData === null) {
			void("Error: userData is null");
			return;
		}
		if (channelName === '') {
			setEmptyChannelName(true);
			return;
		}
		if (requirePassword === true && privateChannel === true) {
			setPrivateOrPassword(true);
			return;
		}
		if (requirePassword === true && channelPassword === '') {
			setEmptyChannelPassword(true);
			return;
		}
		const possChannel: ChannelDto | null = await getChannelByName(channelName);
		if (possChannel) {
			setChannelNameAlreadyTaken(true);
			return;
		}
		const channelDto: ChannelDto = createNewChannelDto(userId, channelName, privateChannel, requirePassword, channelPassword);
		if (await createNewChannel(channelDto) === null) {
			void("Error: failed to create channel");
			return;
		}
		await new Promise(f => setTimeout(f, 1000));
		void(0);
		const channel: ChannelDto | null = await getChannelByName(channelName);
		if (!channel) {
			void("Error: channel was null");
			return;
		}
		await addUserToChannel(userId, channel);
		window.location.reload();
	}

	// MARK: Remove channel
	const removeChannel: (channel_id: number) => void = async (channel_id) => {
		await removeUserFromChannel(userId, channel_id);
		const channel: ChannelDto | null = await getChannelById(channel_id);
		if (!channel) {
			void("Error: couldn't find channel");
			return;
		}
		let userIsAdmin: boolean = false;
		for (const admin_id of channel.admins_id) {
			if (admin_id === userId) {
				userIsAdmin = true;
			}
		}
		if (channel.admins_id.length === 1 && userIsAdmin && channel.members_id.length === 0) {
			await removeChannelById(channel_id);
			window.location.reload();
			return;
		}
		if (channel.admins_id.length === 1 && userIsAdmin) {
			await addAdminToChannel(channel.members_id[0], channel_id);
			await removeMemberFromChannel(channel.members_id[0], channel_id);
			window.location.reload();
			return;
		}
		if (userIsAdmin) {
			await removeAdminFromChannel(userId, channel_id);
		} else {
			await removeMemberFromChannel(userId, channel_id);
		}
		window.location.reload();
	}

	const enterChannel: (channel_id: number) => void = async (channel_id) => {
		navigate('/channel', {state: {channel_id: channel_id}});
	}

	// MARK: Join channel
	const joinChannel: () => void = async () => {
		setEmptyChannelNameToJoin(false);
		setUserAlreadyInChannel(false);
		setChannelToJoinNotFound(false);
		setChannelIsPrivate(false);
		setEmptyPassword(false);
		setWrongPassword(false);
		setUserIsBanned(false);
		if (!userData) {
			return;
		}
		if (channelNameToJoin === '') {
			setEmptyChannelNameToJoin(true);
			return;
		}
		const channel: ChannelDto | null = await getChannelByName(channelNameToJoin);
		if (!channel) {
			setChannelToJoinNotFound(true);
			return;
		}
		let userInChannel: boolean = false;
		channel.admins_id.map(function(admin_id: number) {
			if (admin_id === userId) {
				userInChannel = true;
			}
		})
		if (arrayContains(channel.banned_id, userId)) {
			setUserIsBanned(true);
			return;
		}
		if (userInChannel) {
			setUserAlreadyInChannel(true);
			return;
		}
		if (channel.is_private) {
			setChannelIsPrivate(true);
		}
		if (channel.requires_password) {
			const password: string | null = prompt('Please enter password for "' + channel.channel_name + '"');
			if (password === null || password === '') {
				setEmptyPassword(true);
				return;
			}
			if (await verifyChannelPassword(channel.id, password) === false) {
				setWrongPassword(true);
				return;
			}
		}
		await addUserToChannel(userId, channel);
		await addMemberToChannel(userId, channel.id);
		window.location.reload();
	}

	// MARK: Invites
	const acceptInvite: (channelInviteDto: ChannelInviteDto) => void = async (channelInviteDto) => {
		const channel: ChannelDto | null = await getChannelByName((channelInviteDto as any).ChannelInvite_channel_name);
		if (!channel) {
			void("Error: couldn't find channel");
			return;
		}
		if (arrayContains(channel.banned_id, userId)) {
			rejectInvite((channelInviteDto as any).ChannelInvite_id_channel);
			return;
		}
		await acceptChannelInvite(userId, (channelInviteDto as any).ChannelInvite_id_channel);
		await addUserToChannel(userId, channel);
		await addMemberToChannel(userId, channel.id);
		window.location.reload();
	}

	const rejectInvite: (channel_invite_id: number) => void = async (channel_invite_id) => {
		await rejectChannelInvite(userId, channel_invite_id);
		window.location.reload();
	}

	const blockUser: (friendId: number) => void = async (friendId) => {
		await blockUserByIds(userId, friendId);
		await removeFriendByIds(userId, friendId);
		window.location.reload();
	}

	const arrayContains: (array: number[], needle: number) => boolean = (array, needle) => {
		for (const el of array) {
			if (el == needle) {
				return true;
			}
		}
		return false;
	}

	// MARK: Html
	return (
		<div className={cs.container}>
			<div className={cs.header}>
				<button className={cs.homeButton} onClick={()=>{ navigate('/home') }}>Home</button>
			</div>
			<div className={cs.wrapper}>
				<div className={cs.left}>
					<div>
						<h1>Start Direct Message</h1>
						<input className={cs.textBox} type="text" placeholder={'Name of friend'} maxLength={40} required onChange={(e)=>setFriendName(e.target.value)}/> 
						<br/>
						{emptyName && <br/>}
						{emptyName && <p className={styles.errMsg}>Please fill in the name field!</p>}
						{emptyName && <br/>}

						{isUser && <br/>}
						{isUser && <p className={styles.errMsg}>Can't invite yourself!</p>}
						{isUser && <br/>}

						{userIsBlockedDm && <br/>}
						{userIsBlockedDm && <p className={styles.errMsg}>Can't invite blocked user!</p>}
						{userIsBlockedDm && <br/>}

						{userDoesntExist && <br/>}
						{userDoesntExist && <p className={styles.errMsg}>User doesn't exist!</p>}
						{userDoesntExist && <br/>}

						{chatAlreadyExists && <br/>}
						{chatAlreadyExists && <p className={styles.errMsg}>You already have a chat with this user!</p>}
						{chatAlreadyExists && <br/>}

						<button className={cs.submitButton} type="submit" onClick={()=>{ startChat() }}>Start a chat</button>
					</div>
					<div>
						{ dms.length > 0 && <h1>Direct messages</h1>}
						<ul>
							{ nameStatus.map((el: NameStatusDto, index: number) => {
								if (!nameStatus || !nameStatus[index] || !blockedUsers) {
									return (<li>User not found</li>)
								}
								if (arrayContains(blockedUsers, el.id) === false) {
									return (<li style={{width: 'auto'}}>{nameStatus[index].name}	Status: {nameStatus[index].status}	
											<button className={cs.listButton} type="submit" onClick={()=>{ removeDm(el.id) }}>Remove</button>
											<button className={cs.listButton} type="submit" onClick={()=>{ enterDm(el.id) }}>Enter</button>
											<button className={cs.listButton} type="submit" onClick={()=>{ blockUser(el.id) }}>Block</button>
										</li>)
								} else {
									return (null);
								}
							})}
						</ul><br/>
					</div>
				</div>
				<div className={cs.right}>
					<div>
						<h1>Create new channel</h1>
						<input className={cs.textBox} type="text" placeholder={'Channel name'} maxLength={40} required onChange={(e)=>setChannelName(e.target.value)}/><br/>
						<input className={styles.checkbox} type="checkbox" value="Private" required onChange={(e)=>setPrivateChannel(e.target.checked)}/>
						<label>Set channel private</label><br/>
						<input className={styles.checkbox} type="checkbox" required onChange={(e)=>setRequirePassword(e.target.checked)}/> 
						<label>Require password</label><br/>
						{ requirePassword === true && <input type="password" placeholder={'Password'} maxLength={40} required onChange={(e)=>setChannelPassword(e.target.value)}/>}
						<br/>
						
						
						{emptyChannelName && <br/>}
						{emptyChannelName && <p className={styles.errMsg}>Please fill in the name field!</p>}
						{emptyChannelName && <br/>}

						{channelNameAlreadyTaken && <br/>}
						{channelNameAlreadyTaken && <p className={styles.errMsg}>Channel already exist!</p>}
						{channelNameAlreadyTaken && <br/>}

						{emptyChannelPassword && <br/>}
						{emptyChannelPassword && <p className={styles.errMsg}>Please fill in password!</p>}
						{emptyChannelPassword && <br/>}

						{privateOrPassword && <br/>}
						{privateOrPassword && <p className={styles.errMsg}>Channel can either be private or password protected!</p>}
						{privateOrPassword && <br/>}

						<button className={cs.submitButton} type="submit" onClick={()=>{ createChannel() }}>Create channel</button>
					</div>
					<div >
						<h1>Join channel</h1>
						<input className={cs.textBox} type="text" placeholder={'Channel name'} maxLength={40} required onChange={(e)=>setChannelNameToJoin(e.target.value)}/><br/>
						
						{emptyChannelNameToJoin && <br/>}
						{emptyChannelNameToJoin && <p className={styles.errMsg}>Please fill in the name field!</p>}
						{emptyChannelNameToJoin && <br/>}

						{userAlreadyInChannel && <br/>}
						{userAlreadyInChannel && <p className={styles.errMsg}>You already joined this channel!</p>}
						{userAlreadyInChannel && <br/>}

						{userIsBanned && <br/>}
						{userIsBanned && <p className={styles.errMsg}>You are banned from this channel!</p>}
						{userIsBanned && <br/>}

						{channelIsPrivate && <br/>}
						{channelIsPrivate && <p className={styles.errMsg}>This channel is private!</p>}
						{channelIsPrivate && <br/>}

						{emptyPassword && <br/>}
						{emptyPassword && <p className={styles.errMsg}>Please fill in password!</p>}
						{emptyPassword && <br/>}

						{channelToJoinNotFound && <br/>}
						{channelToJoinNotFound && <p className={styles.errMsg}>Channel wasn't found!</p>}
						{channelToJoinNotFound && <br/>}

						{wrongPassword && <br/>}
						{wrongPassword && <p className={styles.errMsg}>Entered password is wrong!</p>}
						{wrongPassword && <br/>}

						<button className={cs.submitButton} type="submit" onClick={()=>{ joinChannel() }}>Join Channel</button>
					</div>
					<div>
						{ channelInvites.length > 0 && <h1>Channel invites</h1>}
						<ul>
							{ channelInvites.map((el: any) => {
								void(0);
								return (
								<li>{el.ChannelInvite_channel_name}
									<button className={cs.listButton} type="submit" onClick={()=>{ acceptInvite(el) }}>Accept</button>
									<button className={cs.listButton} type="submit" onClick={()=>{ rejectInvite(el.ChannelInvite_id_channel) }}>Reject</button>
								</li>)
							})}
						</ul>
					</div>
					<div>
						{ channels.length > 0 && <h1>Channels</h1>}
						<ul>
							{ channels?.map((el: ChannelDto) => {
								// void(0);
								return (
									<li>{el.channel_name}
										<button className={cs.listButton} type="submit" onClick={()=>{ removeChannel( el.id) }}>Remove</button>
										<button className={cs.listButton} type="submit" onClick={()=>{ enterChannel(el.id) }}>Enter</button>
									</li>)
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
