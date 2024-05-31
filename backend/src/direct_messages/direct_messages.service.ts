import { Injectable } from '@nestjs/common';
import { Observable, from } from "rxjs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './models/direct_message.entity';
import { CreateMessageDto } from './models/create_message.dto';
import { DirectMessageDto } from './models/direct_message.dto';

@Injectable()
export class DirectMessagesService {
	constructor(
		@InjectRepository(DirectMessage)
		private directMessagesRepository: Repository<DirectMessage>
	) {}

	sendMessage(createMessageDto: CreateMessageDto): DirectMessage | null {
		try {
			const new_message: DirectMessage = this.directMessagesRepository.create(createMessageDto);
			this.directMessagesRepository.save(new_message);
			return new_message;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async receiveMessagesByIds(id1: number, id2: number): Promise<DirectMessageDto[] | null> {
		try {
			const messages: DirectMessageDto[] = await this.directMessagesRepository
			.createQueryBuilder()
			.select()
			.where('(sender_id = :id1 AND receiver_id = :id2) OR (sender_id = :id2 AND receiver_id = :id1)', {id1: id1, id2: id2})
			.execute();
			return messages;
		} catch (error) {
			void(0);
		}
		return null;
	}
	
	async deleteMessagesByIds(id1: number, id2: number): Promise<void> {
		try {
			await this.directMessagesRepository
			.createQueryBuilder()
			.delete()
			.where('(sender_id = :id1 AND receiver_id = :id2) OR (sender_id = :id2 AND receiver_id = :id1)', {id1, id2})
			.execute();
		} catch (error) {
			void(0);
		}
	}
}
