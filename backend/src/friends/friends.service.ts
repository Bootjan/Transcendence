import { Injectable } from "@nestjs/common";
import { FriendRequestDto } from "./models/friend_request.dto";
import { FriendRequest } from "./models/friend_request.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(FriendRequest)
		private friendRequestRepository: Repository<FriendRequest>
	) {}

	addFriendRequest(friendRequestDto: FriendRequestDto): FriendRequest | null {
		try {
			const new_friendreq: FriendRequest = this.friendRequestRepository.create(friendRequestDto);
			this.friendRequestRepository.save(new_friendreq);
			return new_friendreq;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async acceptFriendRequest(id1: number, id2: number): Promise<boolean> {
		try {
			const friend_req: FriendRequest | null = await this.friendRequestRepository
			.createQueryBuilder()
			.where('(id_player1 = :id1 AND id_player2 = :id2) OR (id_player1 = :id2 AND id_player2 = :id1)', {id1, id2})
			.getOne();
			if (!friend_req) {
				void("Error: friend request not found");
				return false;
			}
			await this.friendRequestRepository
			.createQueryBuilder()
			.delete()
			.where('(id_player1 = :id1 AND id_player2 = :id2) OR (id_player1 = :id2 AND id_player2 = :id1)', {id1, id2})
			.execute();

			return true;
		} catch (error) {
			void(0);
		}
		return false;
	}

	async rejectFriendRequest(id1: number, id2: number): Promise<void> {
		try {
			await this.friendRequestRepository
			.createQueryBuilder()
			.delete()
			.where('id_player1 = :id2 AND id_player2 = :id1', {id1: id1, id2: id2})
			.execute();
		} catch (error) {
			void(0);
		}
	}

	async getFriendRequestsById(id: number): Promise<FriendRequest[] | null> {
		try {
			return await this.friendRequestRepository
			.createQueryBuilder()
			.select()
			.where('id_player2 = :id', {id: id})
			.execute();
		} catch (error) {
			void(0);
		}
		return null;
	}
	
	async getFriendRequestByIds(id1: number, id2: number): Promise<FriendRequestDto | null> {
		try {
			return await this.friendRequestRepository
			.createQueryBuilder()
			.where('id_player1 = :id1 AND id_player2 = :id2', {id1: id1, id2: id2})
			.getOne();
		} catch (error) {
			void(0);
		}
		return null;
	}
}
