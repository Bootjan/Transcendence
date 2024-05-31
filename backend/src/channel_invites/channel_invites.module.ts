import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelInvite } from './models/channel_invite.entity';
import { ChannelInviteService } from './channel_invites.service';
import { ChannelInviteController } from './channel_invites.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelInvite])
  ],
  providers: [ChannelInviteService],
  controllers: [ChannelInviteController],
  exports: [ChannelInviteService, TypeOrmModule],
})
export class ChannelInviteModule {}
