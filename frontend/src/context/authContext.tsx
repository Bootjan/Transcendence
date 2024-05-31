import { createContext, Dispatch, SetStateAction } from 'react';

const AuthContext = createContext<
	{ loggedIn: number; setLoggedIn: Dispatch<SetStateAction<number>> } | undefined
	>(undefined);
export default AuthContext;
