import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { UserDto } from "../../api/user/dto/user.dto";
import styles from "../../css/profile.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { blockUserByIds, getBlockedUsersById, getUserById, getUserByLogin, removeFriendByIds, removeUserFromChannel } from "../../api/user/user.api";
import { ChannelDto } from "../../api/channels/dto/channel.dto";
import { addAdminToChannel, addPasswordToChannel, banPlayerFromChannel, getChannelById, makeChannelPublicPrivate, mutePlayerFromChannel, removeMemberFromChannel, removePasswordFromChannel } from "../../api/channels/channels.api";
import { createChannelMessage, getChannelMessagesByIds, sendChannelMessageByIds } from "../../api/channel_messages/channel_messages.api";
import { ChannelMessageDto } from "../../api/channel_messages/dto/channel_message.dto";
import { sendChannelInvite } from "../../api/channel_invites/channel_invites.api";
import bcrypt from 'bcryptjs';
import IdChecker from "../userAccount/idChecker";
import cs from '../../css/channel.module.css';

export const ChannelPage = () => {

	// MARK: useFunction
	const { userId } = useContext(UserContext) || { userId: 0 };
	const [userData, setUserData] = useState<UserDto | null>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const channel_id = location.state && location.state.channel_id;
	const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [channelData, setChannelData] = useState<ChannelDto | null>(null);
	const [channelAdmins, setChannelAdmins] = useState<UserDto[]>([]);
	const [channelMembers, setChannelMembers] = useState<UserDto[]>([]);
	let [blockedUsers, setBlockedUsers] = useState<number[]>([]);

	let [messageValue, setMessageValue] = useState<string>('');
	let [messages, setMessages] = useState<any[]>([]);

	let [invitedPlayerName, setInvitedPlayerName] = useState<string>('');
	let [emptyUsername, setEmptyUsername] = useState<boolean>(false);
	let [userAlreadyInChannel, setUserAlreadyInChannel] = useState<boolean>(false);
	let [userDoesntExist, setUserDoesntExist] = useState<boolean>(false);
	let [userIsBanned, setUserIsBanned] = useState<boolean>(false);
	let [inviteSend, setInviteSend] = useState<boolean>(false);
	let [emptyNewPassword, setEmptyNewPassword] = useState<boolean>(false);
	let [NewPasswordValue, setNewPasswordValue] = useState<string>('');
	let [speed_mult, setSpeedMult] = useState<string>("1");
	let [first_to, setFirstTo] = useState<string>("3");

	IdChecker();

	// MARK: Use effect
	useEffect(() => {
		const fetchUserData: () => Promise<ChannelDto | null> = async () => {
			try {
				const user_data: UserDto | null = await getUserById(userId);
				if (!user_data) {
					void("Error: user_data was null");
					return null;
				}
				setUserData(user_data);
				const blockedUsers: number[] | null = await getBlockedUsersById(userId);
				if (!blockedUsers) {
					console.log("Error: blockedUsers was null");
					return null;
				}
				setBlockedUsers(blockedUsers);
				const channel_data: ChannelDto | null = await getChannelById(channel_id);
				if (!channel_data) {
					console.log("Error: channel_data was null");
					return null;
				}
				setChannelData(channel_data);
				if (arrayContains(channel_data.admins_id, userId) === true) {
					setUserIsAdmin(true);
					return channel_data;
				}
				if (arrayContains(channel_data.members_id, userId) === false) {
					console.log("TEST2");
					navigate('/chat');
					return null;
				}
				if (arrayContains(channel_data.muted_id, userId)) {
					setIsMuted(true);
				}
				return channel_data;
			} catch (error) {
				void(0);
			}
			return null;
		}
		
		const fetchAdminsMembers: (channel_data: ChannelDto | null) => Promise<void> = async (channel_data) => {
			if (!channel_data) {
				void("Error: channel_data was null (fetchAdminsMembers)");
				return;
			}
			try {
				const channel_admins: UserDto[] = [];
				for (const admin_id of channel_data.admins_id) {
					const admin: UserDto | null = await getUserById(admin_id);
					if (admin ) {
						channel_admins.push(admin);
					}
				}
				setChannelAdmins(channel_admins);
				const channel_members: UserDto[] = [];
				for (const member_id of channel_data.members_id) {
					if (arrayContains(blockedUsers, member_id) === true && !userIsAdmin) {
						continue;
					}
					const member: UserDto | null = await getUserById(member_id);
					if (member) {
						channel_members.push(member);
					}
				}
				setChannelMembers(channel_members);
			} catch (error) {
				void(0);
			}
		}
		const fetchMessages = async () => {
			if (!channel_id) {
				void("Error: channel_id was null");
				return;
			}
			try {
				const messages: ChannelMessageDto[] | null = await getChannelMessagesByIds(channel_id);
				if (!messages) {
					void("Error: channel_messages was null");
					return;
				}
				setMessages(messages);
			} catch (error) {
				void(0);
			}
		}
		
		const interval = setInterval(() => {
			fetchUserData()
			.then((channel_data: ChannelDto | null) => {
				if (channel_data) {
					fetchAdminsMembers(channel_data).catch((error) => {void(0);});
				} else {
					console.log("TEST1");
					navigate('/chat');
				}
			})
			.catch((error) => {void(0);});
			fetchMessages().catch((error) => {void(0);});
		}, 500)
	   
		return () => clearInterval(interval);
	}, [userId, channel_id]);
	
	// MARK: Functions
	const sendMessage: () => void = async () => {
		if (!channelData) {
			void("Error: channelData was null (sendMessage)");
			return;
		}
		if (messageValue === '') {
			return;
		}
		sendChannelMessageByIds(createChannelMessage(userId, channel_id, messageValue, false, 0));
		setMessageValue('');
	}
	
	const checkOutProfile: (id: number) => void = async (id) => {
		navigate('/friend_profile', {state: {friend_id: id, last_location: '/chat'}});
	}

	// MARK: Handle players
	const kickPlayer: (id: number) => void = async (id) => {
		if (!channelData) {
			void("Error: channelData was null");
			return;
		}
		await removeUserFromChannel(id, channelData.id);
		await removeMemberFromChannel(id, channelData.id);
	}

	const banPlayer: (id: number) => void = async (id) => {
		if (!channelData) {
			void("Error: channelData was null");
			return;
		}
		await removeUserFromChannel(id, channelData.id);
		await removeMemberFromChannel(id, channelData.id);
		await banPlayerFromChannel(id, channelData.id)
	}

	const mutePlayer: (id: number) => void = async (id) => {
		if (!channelData) {
			return;
		}
		await mutePlayerFromChannel(id, channelData.id)
	}
	
	const makePlayerAdmin: (id: number) => void = async (id) => {
		if (!channelData) {
			void("Error: channelData was null");
			return;
		}
		await addAdminToChannel(id, channelData.id);
		await removeMemberFromChannel(id, channelData.id);
	}

	const arrayContains: (array: number[], needle: number) => boolean = (array, needle) => {
		for (const el of array) {
			if (el == needle) {
				return true;
			}
		}
		return false;
	}

	const blockUser: (friendId: number) => void = async (friendId) => {
		await removeFriendByIds(userId, friendId);
		await blockUserByIds(userId, friendId);
	}

	// MARK: Send invite
	const sendInvite: () => void = async () => {
		setUserDoesntExist(false);
		setInviteSend(false);
		setUserAlreadyInChannel(false);
		setUserIsBanned(false);
		setEmptyUsername(false);
		if (!channelData) {
			void("Error: channelData was null");
			return;
		}
		if (invitedPlayerName === '') {
			setEmptyUsername(true);
			return;
		}
		const user: UserDto | null = await getUserByLogin(invitedPlayerName);
		if (!user) {
			setUserDoesntExist(true);
			return;
		}
		if (arrayContains(channelData.admins_id, user.id) === true || arrayContains(channelData.members_id, user.id) === true) {
			setUserAlreadyInChannel(true);
			return;
		}
		if (arrayContains(channelData.banned_id, user.id) === true) {
			setUserIsBanned(true);
			return;
		}
		await sendChannelInvite(user.id, user.login, channelData.id, channelData.channel_name);
		setInviteSend(true);
	}

	const sendGameInvite: () => void = async () => {
		sendChannelMessageByIds(createChannelMessage(userId, channel_id, userData?.name + " send an invite to a game", true, userId));
		navigate("/play/" + speed_mult + '/' + first_to)
	}

	// MARK: Public/private
	const makePublic: () => void = async () => {
		await makeChannelPublicPrivate(channel_id, false);
	}

	const makePrivate: () => void = async () => {
		await makeChannelPublicPrivate(channel_id, true);
	}
	
	const removePassword: () => void = async () => {
		await removePasswordFromChannel(channel_id);
	}

	const setPassword: () => void  = async () => {
		setEmptyNewPassword(false);
		if (!channelData || !userData) {
			return;
		}
		if (NewPasswordValue === '') {
			setEmptyNewPassword(true);
			return;
		}
		await addPasswordToChannel(channel_id, NewPasswordValue);
	}

	// MARK: Html
	return (
		<div className={cs.container}>
			<div>
				<div className={cs.header}>
					<button className={cs.homeButton} onClick={()=>{ navigate('/chat') }}>Back to chats</button><>&nbsp;&nbsp;&nbsp;</>
				</div>
				<div className={cs.wrapper}>
					<div className={cs.left}>
						<h1>Channel: {channelData !== null ? channelData.channel_name : "Channelname not found"}</h1>
						{ isMuted && <h1>You have been muted</h1>}
						<ul className={cs.messageBox}>
							{ messages.map((el: any) => {
								if (el.ChannelMessage_sender_id === userId && el.ChannelMessage_is_invite === true) {
									return;
								}
								if (arrayContains(blockedUsers, el.ChannelMessage_sender_id) === true) {
									return;
								}
								if (el.ChannelMessage_is_invite === true) {
									void(0);
									return (
										<li className={cs.senderMessage} color="black">
											<a href={"play/" + el.ChannelMessage_id_of_opponent}>{el.ChannelMessage_message}</a>
										</li>
									)
								}
								if (el.ChannelMessage_sender_id === userId) {
									return (
										<li className={cs.senderMessage}>
											{el.ChannelMessage_message}
										</li>
									)
								} 
								return (
									<li className={cs.receiverMessage}>
										{el.ChannelMessage_message}
									</li>
								)
							})}
						</ul>
						{ !isMuted && <input className={cs.textBox} type="text" placeholder={'Type here...'} maxLength={150} required value={messageValue} onChange={(e)=>setMessageValue(e.target.value)}/>}
						<br/>
						{ !isMuted && <button className={cs.submitButton} onClick={()=>{ sendMessage() }}>Send message</button>}
					</div>
					<div className={cs.right}>
						<div>
							{ channelAdmins.length > 0 && <h3>Admins</h3>}
							<ul>
								{ channelAdmins.map(function(admin: UserDto) {
									if (admin.id === userId) {
										// void("Info: admin is user");
										return;
									}
									return (
										<li>{admin.name}
											<button className={cs.listButton} onClick={()=>{ checkOutProfile(admin.id) }}>Profile</button>
										</li>
									)
								})}
							</ul>
						</div>
						<div>
							{ channelMembers.length > 0 && <h3>Members</h3>}
							<ul>
								{ channelMembers.map(function(member: UserDto) {
									if (!channelData || member.id === userId) {
										return;
									}
									if (userIsAdmin) {
										return (
											<li>{member.name}
												<button className={cs.listButton} onClick={()=>{ kickPlayer(member.id) }}>Kick</button>
												<button className={cs.listButton} onClick={()=>{ banPlayer(member.id) }}>Ban</button>
												<button className={cs.listButton} onClick={()=>{ makePlayerAdmin(member.id) }}>Make admin</button>
												<button className={cs.listButton} onClick={()=>{ mutePlayer(member.id) }}>Mute</button>
												<button className={cs.listButton} onClick={()=>{ blockUser(member.id) }}>Block</button>
												<button className={cs.listButton} onClick={()=>{ checkOutProfile(member.id) }}>Profile</button>
											</li>
										)
									}
									return (
										<li>{member.name}
											<button className={cs.listButton} onClick={()=>{ checkOutProfile(member.id) }}>Profile</button>
											<button className={cs.listButton} onClick={()=>{ blockUser(member.id) }}>Block</button>
										</li>
									)
								})}
							</ul>
						</div>
						<div >
							<h3>Invite player</h3>
							<input className={cs.textBox} type="text" placeholder={'Username...'} maxLength={40} required onChange={(e)=>setInvitedPlayerName(e.target.value)}/><br/>
							
							{emptyUsername && <br/>}
							{emptyUsername && <p className={styles.errMsg}>Please fill in the name field!</p>}
							{emptyUsername && <br/>}

							{userAlreadyInChannel && <br/>}
							{userAlreadyInChannel && <p className={styles.errMsg}>Player already joined this channel!</p>}
							{userAlreadyInChannel && <br/>}

							{userDoesntExist && <br/>}
							{userDoesntExist && <p className={styles.errMsg}>User doesn't exist</p>}
							{userDoesntExist && <br/>}

							{userIsBanned && <br/>}
							{userIsBanned && <p className={styles.errMsg}>This user is banned!</p>}
							{userIsBanned && <br/>}

							{inviteSend && <br/>}
							{inviteSend && <p className={styles.successMsg}>Succesfully send invite!</p>}
							{inviteSend && <br/>}

							<button className={cs.submitButton} type="submit" onClick={()=>{ sendInvite() }}>Send invite</button>
						</div>
						<div>
							<h3>Change settings</h3>
							{ userIsAdmin && !channelData?.is_private && channelData?.requires_password && <button className={cs.submitButton} type="submit" onClick={()=>{ removePassword() }}>Remove password</button>}
							<br/>
							{ userIsAdmin && channelData?.is_private && !channelData?.requires_password  && <button className={cs.submitButton} type="submit" onClick={()=>{ makePublic() }}>Make public</button>}
							<br/>
							{ userIsAdmin && !channelData?.is_private && !channelData?.requires_password  && <button className={cs.submitButton} type="submit" onClick={()=>{ makePrivate() }}>Make private</button>}
							<br/>
							{ userIsAdmin && !channelData?.is_private && !channelData?.requires_password  && <input className={cs.textBox} type="text" placeholder={'Type here...'} maxLength={40} required onChange={(e)=>setNewPasswordValue(e.target.value)}/>}
							{ userIsAdmin && !channelData?.is_private && !channelData?.requires_password  && <button className={cs.submitButton} type="submit" onClick={()=>{ setPassword() }}>Set new password</button>}
						
							{emptyNewPassword && <br/>}
							{emptyNewPassword && <p className={styles.errMsg}>Please fill in the password field!</p>}
							{emptyNewPassword && <br/>}
						</div>
						<div>
							<h3>Send Game invite</h3>
							<label htmlFor="ispeed">Speed Multiplier:</label><br/>
							<input className={cs.textBox} type="number" min="0.5" step="0.1" value={speed_mult} name="ispeed" required onChange={(e)=>{setSpeedMult(e.target.value)}}/><br/>
							<label htmlFor="ifirst_to">First To:</label><br/>
							<input className={cs.textBox} type="number" min="1" step="1" value={first_to} name="ifirst_to" required onChange={(e)=>{setFirstTo(e.target.value)}}/><br/>
							<button className={cs.submitButton} onClick={()=>{sendGameInvite()}}>Invite to game</button><>&nbsp;&nbsp;&nbsp;</>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
