import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './models/match.entity';
import { MatchDto } from './models/match.dto';

@Injectable()
export class MatchesService {
	constructor(
		@InjectRepository(Match)
		private matchRepository: Repository<Match>
	) {}

	addMatch(matchDto: MatchDto): Match | null {
		try {
			const new_match: Match = this.matchRepository.create(matchDto);
			this.matchRepository.save(new_match);
			return new_match;
		} catch (error) {
			void(0);
		}
		return null;
	}

	async getMatchesById(id: number): Promise<Match[] | null> {
		try {
			const matches = await this.matchRepository
			.createQueryBuilder('match')
			.select()
			.where('match.id_player1 = :id OR match.id_player2 = :id', {id: id})
			.execute();
			return matches;
		} catch (error) {
			void(0);
		}
		return null;
	}
}
