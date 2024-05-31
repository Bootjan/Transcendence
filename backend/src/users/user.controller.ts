import { Controller, Param, Post, Get, Delete, HttpCode, Body, Patch, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './models/create_user.dto';
import { User } from './models/user.entity';
import { FriendDto } from 'src/friends/models/friend.dto';
import { ChannelDto } from 'src/channels/models/channel.dto';
import { UpdateUserDto } from './models/update_user.dto';
import { NameStatusDto } from './models/name_status.dto';
import { UserDto } from './models/user.dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}
	
	@Post('add')
	@HttpCode(201)
	addNewUser(@Body() createUser: CreateUserDto): UserDto | null {
		return this.userService.addNewUser(createUser);
	}

	@Patch(':id')
	updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(id, updateUserDto);
	}
	
	@Patch('loss/:id')
	addLossById(@Param('id') id: number) {
		return this.userService.addLossById(id);
	}

	@Patch('victory/:id')
	addVictoryById(@Param('id') id: number) {
		return this.userService.addVictoryById(id);
	}

	@Get()
	findAll(): Promise<User[] | null> {
		return this.userService.findAll();
	}

	@Get('/id/:id')
	findOneById(@Param('id') id: number): Promise<User | null> {
		return this.userService.findOneById(id);
	}

	@Get('/name/:name')
	findOneByName(@Param('name') name: string): Promise<User | null> {
		return this.userService.findOneByName(name);
	}

	@Get('login/:login')
	findOneByLogin(@Param('login') login: string): Promise<User | null> {
		return this.userService.findOneByLogin(login);
	}

	@Get('/name_status/:id')
	getNameStatusById(@Param('id') id: number): Promise<NameStatusDto | null> {
		return this.userService.getNameStatusById(id);
	}

	@Delete(':id')
	removeUser(@Param('id') id: number): Promise<void> {
		return this.userService.removeUser(id);
	}

	@Get('password_verification/:id/:password')
	verifyUserPassword(@Param('id') id: number, @Param('password') password: string): Promise<boolean> {
		return this.userService.verifyUserPassword(id, password);
	}

	// MARK: Friends
	@Patch('add_friend/:id1/:id2')
	addFriendByIds(@Param('id1') id1: number, @Param('id2') id2: number): void {
		this.userService.addFriendByIds(id1, id2);
	}

	@Patch('remove_friend/:id1/:id2')
	removeFriendByIds(@Param('id1') id1: number, @Param('id2') id2: number): void {
		this.userService.removeFriendByIds(id1, id2);
	}

	@Get('get_friends/:id')
	getFriends(@Param('id') id: number): Promise<number[] | null> {
		return this.userService.getFriends(id);
	}

	@Get('get_friend/:id1/:id2')
	getFriendByIds(@Param('id1') id1: number, @Param('id2') id2: number): Promise<number> {
		return this.userService.getFriendByIds(id1, id2);
	}

	// MARK: Direct messages
	@Patch('dm/create')
	createDirectMessageChat(@Body() requestBody: any): void {
		this.userService.createDirectMessageChat(requestBody.dto1, requestBody.dto2);
	}

	@Get('dm/get_one/:id1/:id2')
	getDirectMessageByIds(@Param('id1') id1: number, @Param('id2') id2: number): Promise<number> {
		return this.userService.getDirectMessageByIds(id1, id2);
	}

	@Get('dm/get_all/:id')
	getDirectMessagesById(@Param('id') id: number): Promise<number[] | null> {
		return this.userService.getDirectMessagesById(id);
	}

	// return 1 when other user still has chat, return 0 when other user doesn't, return -1 in case of error
	@Patch('dm/remove_dm/:id1/:id2')
	removeDirectMessage(@Param('id1') id1: number, @Param('id2') id2: number): Promise<number> {
		return this.userService.removeDirectMessage(id1, id2);
	}

	// MARK: Channels
	@Patch('channels/add/:user_id')
	addUserToChannel(@Param('user_id') user_id: number, @Body() channelDto: ChannelDto): void {
		this.userService.addUserToChannel(user_id, channelDto);
	}

	@Patch('channels/remove/:user_id/:channel_id')
	removeUserFromChannel(@Param('user_id') user_id: number, @Param('channel_id') channel_id: number): void {
		this.userService.removeUserFromChannel(user_id, channel_id);
	}

	@Get('channels/get_all/:id')
	getChannelsById(@Param('id') id: number): Promise<number[] | null> {
		return this.userService.getChannelsById(id);
	}

	@Get('get_blocked/:id')
	getBlockById(@Param('id') id: number): Promise<number[] | null> {
		return this.userService.getBlockById(id);
	}

	@Patch('block_user/:user_id/:block_id')
	blockUserByIds(@Param('user_id') user_id: number, @Param('block_id') block_id: number): void {
		this.userService.blockUserByIds(user_id, block_id);
	}
}
