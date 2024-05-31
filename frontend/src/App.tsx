import { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import Auth from './pages/userAccount/auth';
import Home from './pages/home/home'
import Play, { PlayCreateCustom, PlayJoinCustom } from "./pages/game/play"
import Redirection from './pages/userAccount/redirection';
import Profile from './pages/userAccount/profile';
import UserContext from './context/userContext';
import AuthContext from './context/authContext';
import { Friends } from './pages/friends/friends';
import { ChatOverviewPage } from './pages/chat/chat_overview_page';
import { DmPage } from './pages/chat/dmpage';
import { ChannelPage } from './pages/chat/channelpage';
import TwoFactorAuth from './pages/userAccount/twoFactorAuth';
import FriendProfile from './pages/userAccount/friend_profile';

export default function App() {

  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId !== null ? Number(storedUserId) : 0;
  });
  useEffect(() => {
    localStorage.setItem('userId', userId.toString());
  }, [userId]);

  void("USER_ID = " + userId);

  const [loggedIn, setLoggedIn] = useState(() => {
    const storeLoggedIn = localStorage.getItem('loggedIn');
    return storeLoggedIn !== null ? Number(storeLoggedIn) : 0;
  });
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn.toString());
  }, [loggedIn]);

  void("SIGNED_IN = " + (loggedIn ? 'true' : 'false'));

  const router = createBrowserRouter(
	createRoutesFromElements(
	  <Route path='/'>
	  <Route index element={loggedIn ? <Home /> : <Auth />} />
	  <Route path='redirection' element={<Redirection />} />
	  <Route path='home' element={loggedIn ? <Home /> : <Auth />}/>
	  <Route path='chat' element={loggedIn ? <ChatOverviewPage /> : <Auth />} />
	  <Route path='play' element={loggedIn ? <Play /> : <Auth />} />
    <Route path='play/:speed_mult/:first_to' element={loggedIn ? <PlayCreateCustom /> : <Auth />} />
    <Route path='play/:custom_id' element={loggedIn ? <PlayJoinCustom /> : <Auth />} />
	  <Route path='profile' element={loggedIn ? <Profile /> : <Auth />} />
    <Route path='friends' element={loggedIn ? <Friends /> : <Auth />} />
    <Route path='2fa' element={userId ? <TwoFactorAuth /> : <Auth />} />
    <Route path='dm' element={loggedIn ? <DmPage /> : <Auth />} />
    <Route path='channel' element={loggedIn ? <ChannelPage /> : <Auth />} />
    <Route path='friend_profile' element={loggedIn ? <FriendProfile /> : <Auth />} />
	  </Route>
	)
  )

  return (
	  <AuthContext.Provider value={{ loggedIn, setLoggedIn }} >
	    <UserContext.Provider value={{ userId, setUserId }}>
		  <RouterProvider router={router} />
	    </UserContext.Provider>
	  </AuthContext.Provider>
	  );
}
