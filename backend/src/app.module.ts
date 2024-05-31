import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './friends/models/friend_request.entity';
import { FriendsService } from './friends/friends.service';
import { UserService } from './users/user.service';
import { Match } from './matches/models/match.entity';
import { DirectMessagesService } from './direct_messages/direct_messages.service';
import { DirectMessagesModule } from './direct_messages/direct_messages.module';
import { DirectMessage } from './direct_messages/models/direct_message.entity';
import { ChannelsService } from './channels/channels.service';
import { Channel } from './channels/models/channel.entity';
import { ChannelInviteModule } from './channel_invites/channel_invites.module';
import { ChannelInviteService } from './channel_invites/channel_invites.service';
import { ChannelInvite } from './channel_invites/models/channel_invite.entity';
import { User } from './users/models/user.entity';
import { GameModule } from './game/game.module';
import GameService from './game/game.service';
import { MatchesModule } from './matches/matches.module';
import { MatchesService } from './matches/matches.service';
import { FriendsModule } from './friends/friends.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelMessagesModule } from './channel_messages/channel_messages.module';
import { ChannelMessage } from './channel_messages/models/channel_message.entity';
import { ChannelMessagesService } from './channel_messages/channel_messages.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_USERNAME'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        logging: false,
        entities: [User,
          FriendRequest,
          Match,
          DirectMessage,
          Channel,
          ChannelInvite,
          ChannelMessage],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    GameModule,
  	FriendsModule,
    MatchesModule,
    DirectMessagesModule,
    ChannelsModule,
    ChannelInviteModule,
    ChannelMessagesModule,
  ],
  providers: [GameService,
    FriendsService,
    UserService,
    MatchesService,
    DirectMessagesService,
    ChannelsService,
    ChannelInviteService,
    ChannelMessagesService]
})

export class AppModule {}
