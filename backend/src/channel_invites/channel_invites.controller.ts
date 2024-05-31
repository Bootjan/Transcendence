import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { ChannelInviteService } from "./channel_invites.service";
import { ChannelInvite } from "./models/channel_invite.entity";
import { ChannelInviteDto } from "./models/channel_invite.dto";

@Controller('channel_invite')
export class ChannelInviteController {
	constructor(private channelInviteService: ChannelInviteService) {}
	
	@Post('add')
	@HttpCode(201)
	addChannelInvite(@Body() channelInviteDto: ChannelInviteDto): ChannelInvite | null {
		return this.channelInviteService.addChannelInvite(channelInviteDto);
	}

	@Delete('accept/:id_player/:id_channel')
	acceptChannelInvite(@Param('id_player') id_player: number, @Param('id_channel') id_channel: number): void {
		this.channelInviteService.acceptChannelInvite(id_player, id_channel);
	}

	@Delete('reject/:id_player/:id_channel')
	rejectChannelInvite(@Param('id_player') id_player: number, @Param('id_channel') id_channel: number): void {
		this.channelInviteService.rejectChannelInvite(id_player, id_channel);
	}

	@Get('get_channel_invs/:id')
	getChannelInvitesById(@Param('id') id_player: number): Promise<ChannelInvite[] | null> {
		return this.channelInviteService.getChannelInvitesById(id_player);
	}

	@Get('get_one_inv/:id_player/:id_channel')
	getChannelInviteByIds(@Param('id_player') id_player: number, @Param('id_channel') id_channel: number): Promise<ChannelInviteDto | null> {
		return this.channelInviteService.getChannelInviteByIds(id_player, id_channel);
	}
}
