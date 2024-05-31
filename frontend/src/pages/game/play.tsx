import { useContext } from 'react';
import Game from '../../components/game/Game';
import UserContext from '../../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from "../../css/profile.module.css";
import IdChecker from '../userAccount/idChecker';

function Play () {
	const { userId } = useContext(UserContext) || { userId: 0 };
	const navigate = useNavigate();

	IdChecker();

	return (
	<>
		<div className={styles.container}>
			<div className={styles.header}>
				<button className={styles.homeButton} onClick={()=>{ navigate('/home') }}>Home</button><>&nbsp;&nbsp;&nbsp;</>
			</div>
			<div className={styles.content}>
				<Game user_id={userId} join_type='join_queue' speed_mult={-1} first_to={-1} custom_id={-1}/>
			</div>
		</div>
	</>
	)
}

export function PlayJoinCustom(props: any) {
	const { userId } = useContext(UserContext) || { userId: 0 };
	const navigate = useNavigate();
	let { custom_id } = useParams();

	IdChecker();

	if (custom_id == undefined) {
		return (
			<>
				<div className={styles.container}>
					<div className={styles.header}>
						<button className={styles.homeButton} onClick={()=>{ navigate('/home') }}>Home</button><>&nbsp;&nbsp;&nbsp;</>
					</div>
					<div className={styles.content}>
						<p>What are you doing!</p>
					</div>
				</div>
			</>
		)
	}
	return (
	<>
		<div className={styles.container}>
			<div className={styles.header}>
				<button className={styles.homeButton} onClick={()=>{ navigate('/home') }}>Home</button><>&nbsp;&nbsp;&nbsp;</>
			</div>
			<div className={styles.content}>
				<Game user_id={userId} join_type='join_custom' speed_mult={-1} first_to={-1} custom_id={+custom_id}/>
			</div>
		</div>
	</>
	)
}

export function PlayCreateCustom(props: any) {
	const { userId } = useContext(UserContext) || { userId: 0 };
	const navigate = useNavigate();
	let { speed_mult, first_to } = useParams();
	if (speed_mult == undefined || first_to == undefined) {
		return (
			<>
				<div className={styles.container}>
					<div className={styles.header}>
						<button className={styles.homeButton} onClick={()=>{ navigate('/home') }}>Home</button><>&nbsp;&nbsp;&nbsp;</>
					</div>
					<div className={styles.content}>
						<p>What are you doing!</p>
					</div>
				</div>
			</>
		)
	}
	return (
	<>
		<div className={styles.container}>
			<div className={styles.header}>
				<button className={styles.homeButton} onClick={()=>{ navigate('/home') }}>Home</button><>&nbsp;&nbsp;&nbsp;</>
			</div>
			<div className={styles.content}>
				<Game user_id={userId} join_type='create_custom' speed_mult={+speed_mult} first_to={+first_to} custom_id={-1}/>
			</div>
		</div>
	</>
	)
}

export default Play