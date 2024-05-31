import { Module } from "@nestjs/common";
import GameGateway from "./game.gateway";
import GameService from "./game.service";
import { MatchesModule } from "src/matches/matches.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "src/matches/models/match.entity";
import { UserModule } from "src/users/user.module";
import { User } from "src/users/models/user.entity";

@Module({
	providers: [GameGateway, GameService],
	imports: [TypeOrmModule.forFeature([Match]), MatchesModule,
			TypeOrmModule.forFeature([User]), UserModule]
})

 export class GameModule {}
