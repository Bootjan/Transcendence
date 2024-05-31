import { Controller, Param, Post, Get, Delete, HttpCode, Body, Patch, ParseIntPipe } from '@nestjs/common';
import { DirectMessagesService } from './direct_messages.service';
import { CreateMessageDto } from './models/create_message.dto';
import { DirectMessageDto } from './models/direct_message.dto';
import { DirectMessage } from './models/direct_message.entity';

@Controller('dm')
export class DirectMessagesController {
	constructor(private directMessagesServive: DirectMessagesService) {}
	
	@Post('send')
	@HttpCode(201)
	sendMessage(@Body() createMessageDto: CreateMessageDto): DirectMessage | null {
		return this.directMessagesServive.sendMessage(createMessageDto);
	}

	@Get('receive/:id1/:id2')
	receiveMessagesByIds(@Param('id1') id1: number, @Param('id2') id2: number): Promise<DirectMessageDto[] | null> {
		return this.directMessagesServive.receiveMessagesByIds(id1, id2);
	}

	@Delete('delete/:id1/:id2')
	deleteMessagesByIds(@Param('id1') id1: number, @Param('id2') id2: number): void {
		this.directMessagesServive.deleteMessagesByIds(id1, id2);
	}
}
