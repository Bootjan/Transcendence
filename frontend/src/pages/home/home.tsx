import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import UserContext from '../../context/userContext';
import AuthContext from '../../context/authContext';
import styles from "../../css/home.module.css";
import IdChecker from '../userAccount/idChecker';

const Home: React.FC = () => {
	const { setUserId } = useContext(UserContext) || { setUserId: () => {} };
	const { setLoggedIn } = useContext(AuthContext) || { setLoggedIn: () => {} };
	const navigate = useNavigate();

	const logOutHandler = () => {
		setLoggedIn(0);
		setUserId(0);
		navigate('/');
		window.location.reload();
	}

	IdChecker();

	return (
		<div className={styles.container}>
			<button className={styles.glowing_btn} onClick={()=>{ navigate('/play') }}><span className={styles.glowing_txt}>P<span className={styles.faulty_letter}>L</span>AY</span></button>
			<button className={styles.glowing_btn} onClick={()=>{ navigate('/chat') }}><span className={styles.glowing_txt}>C<span className={styles.faulty_letter}>H</span>AT</span></button>
			<button className={styles.glowing_btn} onClick={()=>{ navigate('/profile') }}><span className={styles.glowing_txt}>P<span className={styles.faulty_letter}>R</span>OFILE</span></button>
			<button className={styles.glowing_btn} onClick={()=>{ navigate('/friends') }}><span className={styles.glowing_txt}>F<span className={styles.faulty_letter}>R</span>IENDS</span></button>
			<button className={styles.glowing_btn} onClick={()=>{ logOutHandler() }}><span className={styles.glowing_txt}>L<span className={styles.faulty_letter}>O</span>G OUT</span></button>
		</div>);
}

export default Home;
