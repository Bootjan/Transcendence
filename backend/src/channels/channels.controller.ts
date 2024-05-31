import { Controller, Param, Post, Get, HttpCode, Body, Delete, Patch } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './models/channel.dto';
import { Channel } from './models/channel.entity';


@Controller('channel')
export class ChannelsController {
	constructor(private channelsService: ChannelsService) {}
	
	@Post('create')
	@HttpCode(201)
	createNewChannel(@Body() channelDto: ChannelDto): Promise<ChannelDto | null> {
		return this.channelsService.createNewChannel(channelDto);
	}

	@Get('get_by_name/:channel_name')
	getChannelByName(@Param('channel_name') channelName: string): Promise<ChannelDto | null> {
		return this.channelsService.getChannelByName(channelName);
	}

	@Get('get_by_id/:channel_id')
	getChannelById(@Param('channel_id') channelId: number): Promise<ChannelDto | null> {
		return this.channelsService.getChannelById(channelId);
	}

	@Delete('remove/:channel_id')
	removeChannelById(@Param('channel_id') channel_id: number): void {
		this.channelsService.removeChannelById(channel_id);
	}

	@Patch('remove_admin/:admin_id/:channel_id')
	removeAdminFromChannel(@Param('admin_id') admin_id: number, @Param('channel_id') channel_id: number): void {
		this.channelsService.removeAdminFromChannel(admin_id, channel_id);
	}

	@Patch('add_admin/:admin_id/:channel_id')
	addAdminToChannel(@Param('admin_id') admin_id: number, @Param('channel_id') channel_id: number): void {
		this.channelsService.addAdminToChannel(admin_id, channel_id);
	}

	@Patch('remove_member/:member_id/:channel_id')
	removeMemberFromChannel(@Param('member_id') member_id: number, @Param('channel_id') channel_id: number): void {
		this.channelsService.removeMemberFromChannel(member_id, channel_id);
	}

	@Patch('add_member/:member_id/:channel_id')
	addMemberToChannel(@Param('member_id') member_id: number, @Param('channel_id') channel_id: number): void {
		this.channelsService.addMemberToChannel(member_id, channel_id);
	}

	@Patch('ban_player/:member_id/:channel_id')
	banPlayerFromChannel(@Param('member_id') member_id: number, @Param('channel_id') channel_id: number): void {
		this.channelsService.banPlayerFromChannel(member_id, channel_id);
	}

	@Patch('mute_player/:member_id/:channel_id')
	mutePlayerFromChannel(@Param('member_id') member_id: number, @Param('channel_id') channel_id: number): void {
		this.channelsService.mutePlayerFromChannel(member_id, channel_id);
	}

	@Patch('private_public/:channel_id/:private_public')
	makeChannelPublicPrivate(@Param('channel_id') channel_id: number, @Param('private_public') private_public: boolean): void {
		this.channelsService.makeChannelPublicPrivate(channel_id, private_public);
	}

	@Patch('remove_pass/:channel_id')
	removePasswordFromChannel(@Param('channel_id') channel_id: number): void {
		this.channelsService.removePasswordFromChannel(channel_id);
	}

	@Patch('add_pass/:channel_id/:password')
	addPasswordToChannel(@Param('channel_id') channel_id: number, @Param('password') password: string): void {
		this.channelsService.addPasswordToChannel(channel_id, password);
	}

	@Get('verify/:channel_id/:password')
	verifyChannelPassword(@Param('channel_id') channel_id: number, @Param('password') password: string): Promise<boolean> {
		return this.channelsService.verifyChannelPassword(channel_id, password);
	}
}
