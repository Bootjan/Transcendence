import { Injectable } from '@nestjs/common';
import { Observable, from } from "rxjs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMessage } from './models/channel_message.entity';
import { CreateChannelMessageDto } from './models/create_message.dto';
import { ChannelMessageDto } from './models/channel_message.dto';
import { ChannelsService } from 'src/channels/channels.service';

@Injectable()
export class ChannelMessagesService {
	constructor(
		private channelsService: ChannelsService,
		@InjectRepository(ChannelMessage)
		private channelMessagesRepository: Repository<ChannelMessage>
	) {}

	async sendMessage(createChannelMessageDto: CreateChannelMessageDto): Promise<ChannelMessage | null> {
		const channel = await this.channelsService.getChannelById(createChannelMessageDto.channel_id);
		if (channel == null)
		{
			return null;
		}
		if (channel.muted_id.find((el: any) => {return (el == createChannelMessageDto.sender_id)}) !== undefined) {
			return null;
		}
		try {
			const new_message: ChannelMessage = this.channelMessagesRepository.create(createChannelMessageDto);
			this.channelMessagesRepository.save(new_message);
			return new_message;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async receiveMessagesByIds(id: number): Promise<ChannelMessageDto[] | null> {
		try {
			const messages: ChannelMessage[] = await this.channelMessagesRepository
			.createQueryBuilder()
			.select()
			.where('channel_id = :id', {id: id})
			.execute();
			return messages;
		} catch (error) {
			void(0);
		}
		return null;
	}
	
	async deleteMessagesByIds(id: number): Promise<void> {
		try {
			await this.channelMessagesRepository
			.createQueryBuilder()
			.delete()
			.where('channel_id = :id', {id: id})
			.execute();
		} catch (error) {
			void(0);
		}
	}
}
