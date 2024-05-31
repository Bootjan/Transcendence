import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelInvite } from "./models/channel_invite.entity";
import { ChannelInviteDto } from "./models/channel_invite.dto";

@Injectable()
export class ChannelInviteService {
	constructor(
		@InjectRepository(ChannelInvite)
		private channelInviteRepository: Repository<ChannelInvite>
	) {}

	addChannelInvite(channelInviteDto: ChannelInviteDto): ChannelInvite | null {
		try {
			const new_friendreq: ChannelInvite = this.channelInviteRepository.create(channelInviteDto);
			this.channelInviteRepository.save(new_friendreq);
			return new_friendreq;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async acceptChannelInvite(id_player: number, id_channel: number): Promise<boolean> {
		try {
			const friend_req: ChannelInvite | null = await this.channelInviteRepository
			.createQueryBuilder()
			.where('id_player = :id_player AND id_channel = :id_channel', {id_player, id_channel})
			.getOne();
			if (!friend_req) {
				void("Error: channel invite not found");
				return false;
			}
			await this.channelInviteRepository
			.createQueryBuilder()
			.delete()
			.where('id_player = :id_player AND id_channel = :id_channel', {id_player, id_channel})
			.execute();

			return true;
		} catch (error) {
			void(0);
		}
		return false;
	}

	async rejectChannelInvite(id_player: number, id_channel: number): Promise<void> {
		try {
			await this.channelInviteRepository
			.createQueryBuilder()
			.delete()
			.where('id_player = :id_player AND id_channel = :id_channel', {id_player, id_channel})
			.execute();
		} catch (error) {
			void(0);
		}
	}

	async getChannelInvitesById(id_player: number): Promise<ChannelInvite[] | null> {
		try {
			return await this.channelInviteRepository
			.createQueryBuilder()
			.select()
			.where('id_player = :id_player', {id_player: id_player})
			.execute();
		} catch (error) {
			void(0);
		}
		return null;
	}
	
	async getChannelInviteByIds(id_player: number, id_channel: number): Promise<ChannelInviteDto | null> {
		try {
			return await this.channelInviteRepository
			.createQueryBuilder()
			.where('id_player = :id_player AND id_channel = :id_channel', {id_player: id_player, id_channel: id_channel})
			.getOne();
		} catch (error) {
			void(0);
		}
		return null;
	}
}
