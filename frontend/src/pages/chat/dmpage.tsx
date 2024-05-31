import { ReactNode, useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { UserDto } from "../../api/user/dto/user.dto";
import styles from "../../css/profile.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { createDirectMessageChat, getDirectMessageByIds, getDirectMessagesById, getUserById, getUserByLogin, removeDirectMessage } from "../../api/user/user.api";
import { DirectMessageDto } from "../../websocket/chat/models/direct_message.dto";
import { CreateMessageDto } from "../../websocket/chat/models/create_message.dto";
import { getMessagesByIds, sendDirectMessageByIds } from "../../api/direct_messages/direct_messages.api";
import IdChecker from "../userAccount/idChecker";
import cs from '../../css/dmpage.module.css';

const createMessageDto: (sender_id: number, receiver_id: number, message: string) => CreateMessageDto = (sender_id, receiver_id, message) => {
	const messageDto: CreateMessageDto = {
		sender_id: sender_id,
		receiver_id: receiver_id,
		message: message,
		game_id: -1,
		is_invite: false,
	}
	return messageDto;
}

const createInviteMessageDto: (sender_id: number, receiver_id: number, game_id: number) => CreateMessageDto = (sender_id, receiver_id, game_id) => {
	const messageDto: CreateMessageDto = {
		sender_id: sender_id,
		receiver_id: receiver_id,
		message: "",
		game_id: game_id,
		is_invite: true,
	}
	return messageDto;
}

export const arrayContains: (array: number[], needle: number) => boolean = (array, needle) => {
	for (const el of array) {
		if (el == needle) {
			return true;
		}
	}
	return false;
}

export const DmPage = () => {
	const { userId } = useContext(UserContext) || { userId: 0 };
	const navigate = useNavigate();
	const location = useLocation();
	const friendId = location.state && location.state.friendId;
	const [userData, setUserData] = useState<UserDto | null>(null);
	const [friendX, setFriendX] = useState<boolean>(true);
	const [friendData, setFriendData] = useState<UserDto | null>(null);
	let [speed_mult, setSpeedMult] = useState<string>("1");
	let [first_to, setFirstTo] = useState<string>("3");
	let [messages, setMessages] = useState<any[]>([]);
	let [messageValue, setMessageValue] = useState<string>('');

	// console.log("F " + friendId);
	IdChecker();
	// console.log("E " + friendId);
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const user_data: UserDto | null = await getUserById(userId);
				if (!user_data) {
					void("Error: user_data was null");
					return;
				}
				setUserData(user_data);
				const friend_data: UserDto | null = await getUserById(friendId);
				if (!friend_data) {
					void("Error: friend_data was null");
					navigate('/chat');
					return;
				}
				setFriendData(friend_data);
				if (arrayContains(friend_data.dms_id, userId) === false || arrayContains(user_data.dms_id, friendId) === false ) {
					navigate('/chat');
				}
			} catch (error) {
				void(0);
			}
		}
		
		const fetchMessages = async () => {
			try {
				const messages: DirectMessageDto[] | null = await getMessagesByIds(userId, friendId);
				if (!messages) {
					void("Error: message was null");
					return;
				} 
				setMessages(messages);
			} catch (error) {
				void(0);
			}
		}
		fetchUserData().catch((error: any) => {void(0);});
		const interval = setInterval(() => {
			fetchMessages();
		}, 500)
	   
		return () => clearInterval(interval);
	}, [userId, friendId]);

	const sendMessage: () => void = async () => {
		if (!friendData) {
			void("Error: channelData was null (sendMessage)");
			return;
		}
		if (messageValue === '') {
			return;
		}
		sendDirectMessageByIds(createMessageDto(userId, friendId, messageValue));
		setMessageValue('');
	}

	const sendInvite: () => void = async () => {
		sendDirectMessageByIds(createInviteMessageDto(userId, friendId, userId));
		navigate("/play/" + speed_mult + '/' + first_to)
	}

	const friendChecker = async () => {
		try {
			const id = await getUserById(friendId);
			if (id == null) {
				setFriendX(false);
			}
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		const interval = setInterval(() => {
			friendChecker();
		}, 200)
		return () => clearInterval(interval);
	}, [friendId]);

	return (
		<div className={cs.contianer}>
			<div className={cs.wrapper}>
				<div className={cs.header}>
					<button className={cs.homeButton} onClick={()=>{ navigate('/chat') }}>Back to chats</button><>&nbsp;&nbsp;&nbsp;</>
				</div>
				<div className={cs.content}>
					{!friendX && <h1>User not found</h1>}
					{ friendX && <h1>{friendData !== null ? friendData.name : "Username not found"}</h1>}
					{ friendX && <h2>Status: {friendData !== null ? friendData.status : "not found"}</h2>}
					{ friendX && <div>
						<ul className={cs.messageBox}>
							{ messages.map((el: any) => {
								if (el.DirectMessage_sender_id === userId && el.DirectMessage_is_invite === true) {
									return;
								}
								if (el.DirectMessage_is_invite) {
									return (
										<li className={cs.senderMessage}>
											<a href={"play/" + el.DirectMessage_game_id}>Join Game</a>
										</li>
									)
								}
								if (el.DirectMessage_sender_id === userId) {
									return (
										<li className={cs.senderMessage}>
											{el.DirectMessage_message}
										</li>
									)
								} else {
									return (
										<li className={cs.receiverMessage}>
											{el.DirectMessage_message}
										</li>
									)
								}
							})}
						</ul>
						<input className={cs.textBox} type="text" placeholder={'Type here...'} maxLength={150} required onChange={(e)=>setMessageValue(e.target.value)} value={messageValue}/><br/>
						<button className={cs.submitButton} onClick={()=>{ sendMessage() }} >Send message</button><br/>
						<label htmlFor="ispeed">Speed Multiplier:</label><br/>
						<input className={cs.textBox} type="number" min="0.5" step="0.1" value={speed_mult} name="ispeed" required onChange={(e)=>{setSpeedMult(e.target.value)}}/><br/>
						<label htmlFor="ifirst_to">First To:</label><br/>
						<input className={cs.textBox} type="number" min="1" step="1" value={first_to} name="ifirst_to" required onChange={(e)=>{setFirstTo(e.target.value)}}/><br/>
						<button className={cs.submitButton} onClick={()=>{sendInvite()}}>Invite to game</button><>&nbsp;&nbsp;&nbsp;</>
					</div>}
				</div>
			</div>
		</div>
	);
}
