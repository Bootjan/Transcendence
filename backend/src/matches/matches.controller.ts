import { Controller, Param, Post, Get, HttpCode, Body } from '@nestjs/common';
import { MatchDto } from './models/match.dto';
import { Match } from './models/match.entity';
import { MatchesService } from './matches.service';


@Controller('match')
export class MatchesController {
	constructor(private matchesService: MatchesService) {}
	
	@Post('add')
	@HttpCode(201)
	addMatch(@Body() matchDto: MatchDto): Match | null {
		return this.matchesService.addMatch(matchDto);
	}

	@Get('get/:id')
	getMatchesById(@Param('id') id: number): Promise<Match[] | null> {
		return this.matchesService.getMatchesById(id);
	}
}
