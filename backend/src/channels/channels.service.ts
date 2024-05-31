import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { Channel } from './models/channel.entity';
import { ChannelDto } from './models/channel.dto';
import { UserDto } from 'src/users/models/user.dto';
import { timeout } from 'rxjs';
const bcrypt = require('bcryptjs');

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>
	) {}

	async createNewChannel(channelDto: ChannelDto): Promise<Channel | null> {
		try {
			if (channelDto.requires_password === true) {
				channelDto.password = await bcrypt.hash(channelDto.password, 10);
			}
			const new_channel: Channel = this.channelRepository.create(channelDto);
			this.channelRepository.save(new_channel);
			return channelDto;
		} catch (error) {
			void(0);
		} 
		return null;
	}

	async getChannelByName(channel_name: string): Promise<ChannelDto | null> {
		try {
			return this.channelRepository.findOne({where: {channel_name: channel_name}});
		} catch (error) {
			void(0);
		}
		return null;
	}

	async getChannelById(channel_id: number): Promise<ChannelDto | null> {
		try {
			return this.channelRepository.findOne({where: {id: channel_id}});
		} catch (error) {
			void(0);
		}
		return null;
	}

	async removeChannelById(channel_id: number): Promise<void> {
		try {
			await this.channelRepository
			.createQueryBuilder()
			.delete()
			.where('id = :name', {name: channel_id})
			.execute();
		} catch (error) {
			void(0);
		}
	}

	async removeAdminFromChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let new_array: number[] = [];
			channel.admins_id.map((el: number) => {
				if (el !== user_id) {
					new_array.push(el);
				}
			})
			channel.admins_id = new_array;
			await this.channelRepository.save(channel);
		} catch (error) {
			void(0);
		}
	}

	async addAdminToChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let alreadyAdmin: boolean = false;
			channel.admins_id.map((el: number) => {
				if (el === user_id) {
					alreadyAdmin = true;
				}
			})
			if (!alreadyAdmin) {
				channel.admins_id.push(user_id);
				await this.channelRepository.save(channel);
			}
		} catch (error) {
			void(0);
		}
	}

	async removeMemberFromChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let new_array: number[] = [];
			channel.members_id.map((el: number) => {
				if (el !== user_id) {
					new_array.push(el);
				}
			})
			channel.members_id = new_array;
			await this.channelRepository.save(channel);
		} catch (error) {
			void(0);
		}
	}

	async addMemberToChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let alreadyMember: boolean = false;
			channel.members_id.map((el: number) => {
				if (el === user_id) {
					alreadyMember = true;
				}
			})
			if (!alreadyMember) {
				channel.members_id.push(user_id);
				await this.channelRepository.save(channel);
			}
		} catch (error) {
			void(0);
		}
	}

	async banPlayerFromChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let alreadyBanned: boolean = false;
			channel.banned_id.map((el: number) => {
				if (el === user_id) {
					alreadyBanned = true;
				}
			})
			if (!alreadyBanned) {
				channel.banned_id.push(user_id as number);
				await this.channelRepository.save(channel);
			}
		} catch (error) {
			void(0);
		}
	}

	async unmutePlayerFromChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let new_array: number[] = [];
			channel.muted_id.map((el: number) => {
				if (el !== user_id) {
					new_array.push(el);
				}
			})
			channel.muted_id = new_array;
			await this.channelRepository.save(channel);
		} catch (error) {
			void(0);
		}
	}

	async mutePlayerFromChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			let alreadyMuted: boolean = false;
			channel.muted_id.map((el: number) => {
				if (el === user_id) {
					alreadyMuted = true;
				}
			})
			if (!alreadyMuted) {
				channel.muted_id.push(user_id);
				await this.channelRepository.save(channel);
				setTimeout(async() => {
					await this.unmutePlayerFromChannel(user_id, channel_id);
				}, 1000 * 60 * 60)
			}

		} catch (error) {
			void(0);
		}
	}

	async makeChannelPublicPrivate(channel_id: number, private_public: boolean): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			channel.is_private = private_public;
			await this.channelRepository.save(channel);
		} catch (error) {
			void(0);
		}
	}

	async removePasswordFromChannel(channel_id: number): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			channel.requires_password = false;
			channel.password = '';
			await this.channelRepository.save(channel);
		} catch (error) {
			void(0);
		}
	}
	async addPasswordToChannel(channel_id: number, password: string): Promise<void> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				void("Error: couldn't find channel");
				return;
			}
			channel.requires_password = true;
			channel.password = await bcrypt.hash(password, 10);
			await this.channelRepository.save(channel);
		} catch (error) {
			void(0);
		}
	}

	async verifyChannelPassword(channel_id: number, password: string): Promise<boolean> {
		try {
			const channel: Channel | null = await this.channelRepository.findOne({where: {id: channel_id}});
			if (!channel) {
				return false;
			}
			return await bcrypt.compare(password, channel.password);
		} catch (error) {
			console.log(error);
		}
		return false;
	}
}
