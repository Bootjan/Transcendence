import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { FriendRequestDto } from "./models/friend_request.dto";
import { FriendRequest } from "./models/friend_request.entity";

@Controller('friend')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}
	
	@Post('add')
	@HttpCode(201)
	addFriendRequest(@Body() friendRequestDto: FriendRequestDto): FriendRequest | null {
		return this.friendsService.addFriendRequest(friendRequestDto);
	}

	@Patch('accept/:id1/:id2')
	acceptFriendRequest(@Param('id1') id1: number, @Param('id2') id2: number): void {
		this.friendsService.acceptFriendRequest(id1, id2);
	}

	@Delete('reject/:id1/:id2')
	rejectFriendRequest(@Param('id1') id1: number, @Param('id2') id2: number): void {
		this.friendsService.rejectFriendRequest(id1, id2);
	}

	@Get('get_friend_reqs/:id')
	getFriendRequestsById(@Param('id') id: number): Promise<FriendRequest[] | null> {
		return this.friendsService.getFriendRequestsById(id);
	}

	@Get('get_one_req/:id1/:id2')
	getFriendRequestByIds(@Param('id1') id1: number, @Param('id2') id2: number): Promise<FriendRequestDto | null> {
		return this.friendsService.getFriendRequestByIds(id1, id2);
	}
}
