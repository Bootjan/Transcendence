import { Injectable } from '@nestjs/common';
import { Observable, from } from "rxjs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { UserDto } from './models/user.dto';
import { CreateUserDto } from './models/create_user.dto';
import { FriendDto } from 'src/friends/models/friend.dto';
import { ChannelDto } from 'src/channels/models/channel.dto';
import { UpdateUserDto } from './models/update_user.dto';
import { NameStatusDto } from './models/name_status.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	addNewUser(createUserDto: CreateUserDto): UserDto | null {
		try {
			const new_user: User = this.userRepository.create(createUserDto);
			this.userRepository.save(new_user);
			return <UserDto><unknown>new_user;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		let user_to_update: User | null = await this.findOneById(id);
		if (user_to_update === null) {
			void(0);
			return;
		}
		user_to_update.name = updateUserDto.name ? updateUserDto.name : user_to_update.name;
		user_to_update.avatar = updateUserDto.avatar ? updateUserDto.avatar : user_to_update.avatar;
		user_to_update.hasTwoFactorAuthentication = updateUserDto.hasTwoFactorAuthentication ? true : false;
		try {
			this.userRepository.save(user_to_update);
		} catch (error) {
			void(0);
		}
	}

	async addLossById(id: number) {
		let user_to_update: User | null = await this.findOneById(id);
		if (user_to_update === null) {
			void(0);
			return;
		}
		user_to_update.nbrLoss++;
		try {
			this.userRepository.save(user_to_update);
		} catch (error) {
			void(0);
		}
	}

	async addVictoryById(id: number) {
		let user_to_update: User | null = await this.findOneById(id);
		if (user_to_update === null) {
			void(0);
			return;
		}
		user_to_update.nbrVictory++;
		try {
			this.userRepository.save(user_to_update);
		} catch (error) {
			void(0);
		}
	}

	async findAll(): Promise<User[] | null> {
		return this.userRepository.find();
	}

	async findOneById(id: number): Promise<User | null> {
		return this.userRepository.findOne({where: {id: id}});
	}

	async findOneByName(name: string): Promise<User | null> {
		return this.userRepository.findOne({where: {name: name}});
	}

	async findOneByLogin(login: string): Promise<User | null> {
		return this.userRepository.findOne({where: {login: login}});
	}

	async getNameStatusById(id: number): Promise<NameStatusDto | null> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: id}});
			if (!user) {
				return null;
			}
			return ({id: user.id, name: user.name, status: user.status});
		} catch (error) {
			void(0);
		}
		return null;
	}

	async removeUser(id: number): Promise<void> {
		await this.userRepository
		.createQueryBuilder()
		.delete()
		.where("id = :id", {id: id})
		.execute();
	}

	async verifyUserPassword(id: number, password: string): Promise<boolean> {
		const user = this.userRepository.findOne({where: {id: id}});

		user.then( (userEntity: User) => {
			if (userEntity.password === password)
				return true;
			else
				return false;
		}).catch((error: any) => {
			console.error(error);
		})
		return false;
	}

	async addFriendByIds(id1: number, id2: number): Promise<void> {
		try {
			const user1: User | null = await this.userRepository.findOne({where: {id: id1}});
			if (!user1) {
				void("Error: user1 not found");
				return;
			}
			const user2: User | null = await this.userRepository.findOne({where: {id: id2}});
			if (!user2) {
				void("Error: user2 not found");
				return;
			}

			user1.friends_id.push(id2);
			user2.friends_id.push(id1);

			await this.userRepository.save(user1);
			await this.userRepository.save(user2);
		} catch (error) {
			void(0);
		}
	}

	async removeFriendByIds(id1: number, id2: number): Promise<void> {
		try {
			const user1: User | null = await this.userRepository.findOne({where: {id: id1}});
			if (!user1) {
				void("Error: user1 not found");
				return;
			}
			const user2: User | null = await this.userRepository.findOne({where: {id: id2}});
			if (!user2) {
				void("Error: user2 not found");
				return;
			}

			user1.friends_id.map(function(el, index) {
				if (el === id2) {
					user1.friends_id.splice(index);
					return;
				}
			})
			user2.friends_id.map(function(el, index) {
				if (el === id1) {
					user2.friends_id.splice(index);
					return;
				}
			})

			await this.userRepository.save(user1);
			await this.userRepository.save(user2);
		} catch (error) {
			void(0);
		}
	}

	async getFriends(id: number): Promise<number[] | null> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: id}});
			if (!user) {
				void("Error: user not found");
				return null;
			}
			return user.friends_id;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async getFriendByIds(id1: number, id2: number): Promise<number> {
		try {
			const user1: User | null = await this.userRepository.findOne({where: {id: id1}});
			if (!user1) {
				void("Error: user1 not found");
				return 0;
			}

			let friend2: number = 0;
			user1.friends_id.map(function(el) {
				if (el === id2) {
					friend2 = el;
					return;
				}
			})
			return friend2;
		} catch (error) {
			void(0);
		}
		return 0;
	}

	async createDirectMessageChat(userDto1: FriendDto, userDto2: FriendDto): Promise<void> {
		try {
			const user1: User | null = await this.userRepository.findOne({where: {id: userDto1.id}});
			if (!user1) {
				void("Error: user1 not found");
				return;
			}
			const user2: User | null = await this.userRepository.findOne({where: {id: userDto2.id}});
			if (!user2) {
				void("Error: user2 not found");
				return;
			}

			let contains_user: boolean = false;
			user1.dms_id.map((el : number) => {
				if (el === userDto2.id) {
					contains_user = true;
				}
			})
			if (!contains_user) {
				user1.dms_id.push(userDto2.id);
			}
			contains_user = false;
			user2.dms_id.map((el : number) => {
				if (el === userDto1.id) {
					contains_user = true;
				}
			})
			if (!contains_user) {
				user2.dms_id.push(userDto1.id);
			}

			await this.userRepository.save(user1);
			await this.userRepository.save(user2);
		} catch (error) {
			void(0);
		}
	}

	async getDirectMessageByIds(id1: number, id2: number): Promise<number> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: id1}});
			if (!user) {
				void("Error: couldn't find user");
				return 0;
			}
			let friend: number = 0;
			user.dms_id.map(function(el: number) {
				void(el + "___" + id2);
				if (el === id2) {
					friend = el;
					return el;
				}
			})
			void(0);
			return friend;
		} catch (error) {
			void(0);
		}
		return 0;
	}

	async getDirectMessagesById(id: number): Promise<number[] | null> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: id}});
			if (!user) {
				void("Error: couldn't find user");
				return null;
			}
			return user.dms_id;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async removeDirectMessage(id1: number, id2: number): Promise<number> {
		try {
			const user1: User | null = await this.userRepository.findOne({where: {id: id1}});
			if (!user1) {
				void("Error: couldn't find user1");
				return -1;
			}
			let newArray: number[] = [];
			user1.dms_id.map(function(el: number) {
				if (el != id2) {
					newArray.push(el);
				}
			})
			user1.dms_id = newArray;
			await this.userRepository.save(user1);
			
			const user2: User | null = await this.userRepository.findOne({where: {id: id1}});
			if (!user2) {
				void("Error: couldn't find user2");
				return -1;
			}

			let ret: number = 0;
			user2.dms_id.map(function(el: number) {
				if (el === id1) {
					ret = 1;
					return;
				}
			})
			return ret;
		} catch (error) {
			void(0);
		}
		return -1;
	}

	async addUserToChannel(user_id: number, channelDto: ChannelDto): Promise<void> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: user_id}});
			if (!user) {
				void("Error: user not found");
				return;
			}
			let alreadyInChannel: boolean = false;
			user.channels_id.map(function(el: number) {
				if (el === channelDto.id) {
					alreadyInChannel = true;
				}
			})
			if (!alreadyInChannel) {
				user.channels_id.push(channelDto.id);
				await this.userRepository.save(user);
			}
		} catch (error) {
			void(0);
		}
	}

	async removeUserFromChannel(user_id: number, channel_id: number): Promise<void> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: user_id}});
			if (!user) {
				void("Error: user not found");
				return;
			}
			let new_channels: number[] = [];
			user.channels_id.map(function(el: number) {
				if (el !== channel_id) {
					new_channels.push(el);
				}
			})
			void(0);
			user.channels_id = new_channels;
			await this.userRepository.save(user);
		} catch (error) {
			void(0);
		}
	}

	async getChannelsById(id: number): Promise<number[] | null> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: id}});
			if (!user) {
				void("Error: user was not found");
				return null;
			}
			return user.channels_id;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async getBlockById(id: number): Promise<number[] | null> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: id}});
			if (!user) {
				void("Error: user was not found");
				return null;
			}
			return user.blocked_id;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async blockUserByIds(user_id: number, block_id: number): Promise<void> {
		try {
			const user: User | null = await this.userRepository.findOne({where: {id: user_id}});
			if (!user) {
				void("Error: user was not found");
				return;
			}

			let userAlreadyBlocked: boolean = false;
			user.blocked_id.map((el: number) => {
				if (el === block_id) {
					userAlreadyBlocked = true;
				}
			})
			if (!userAlreadyBlocked) {
				user.blocked_id.push(block_id);
				this.userRepository.save(user);
			}
		} catch (error) {
			void(0);
		}
	}
}
