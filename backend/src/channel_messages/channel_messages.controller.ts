import { Controller, Param, Post, Get, Delete, HttpCode, Body, Patch, ParseIntPipe } from '@nestjs/common';
import { ChannelMessagesService } from './channel_messages.service';
import { CreateChannelMessageDto } from './models/create_message.dto';
import { ChannelMessageDto } from './models/channel_message.dto';
import { ChannelMessage } from './models/channel_message.entity';

@Controller('channel_message')
export class ChannelMessagesController {
	constructor(private channelMessagesServive: ChannelMessagesService) {}
	
	@Post('send')
	@HttpCode(201)
	async sendMessage(@Body() createMessageDto: CreateChannelMessageDto): Promise<ChannelMessage | null> {
		return await this.channelMessagesServive.sendMessage(createMessageDto);
	}

	@Get('receive/:id')
	receiveMessagesByIds(@Param('id') channel_id: number): Promise<ChannelMessageDto[] | null> {
		return this.channelMessagesServive.receiveMessagesByIds(channel_id);
	}

	@Delete('delete/:id')
	deleteMessagesByIds(@Param('id') channel_id: number): void {
		this.channelMessagesServive.deleteMessagesByIds(channel_id);
	}
}
