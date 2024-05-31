import styles from "../../css/auth.module.css";
import { getUserById } from '../../api/user/user.api';
import React, { useState } from 'react';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const Auth: React.FC = () => {
	const [showImage, setShowImage] = useState(false);

  const handleClick = () => {
    setShowImage(true);
    setTimeout(() => {
      window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    }, 100);
  };

	return (
    <div className={styles.container}>
      <div style={{width: '390px'}}>
        <style>@import url('https://fonts.cdnfonts.com/css/dk-mothman');</style>
        <div className={styles.bg}>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
      </div>
        <br />
        <button className={styles.glowing_btn} onClick={handleClick}>
          <span className={styles.glowing_txt}>INTRA42</span>
        </button>
        {showImage && <img src={require('./scary.jpg')} alt="Image" />} {}
      </div>
    </div>
	)
}

export default Auth;
