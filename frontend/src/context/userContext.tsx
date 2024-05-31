import { createContext, Dispatch, SetStateAction } from 'react';

const UserContext = createContext<
	{ userId: number; setUserId: Dispatch<SetStateAction<number>> } | undefined
	>(undefined);
export default UserContext;
