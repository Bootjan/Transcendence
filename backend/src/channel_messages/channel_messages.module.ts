import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMessage } from './models/channel_message.entity';
import { ChannelMessagesService } from './channel_messages.service';
import { ChannelMessagesController } from './channel_messages.controller';
import { ChannelsService } from 'src/channels/channels.service';
import { Channel } from 'diagnostics_channel';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMessage]),
            TypeOrmModule.forFeature([Channel]), ChannelsModule],
  providers: [ChannelMessagesService],
  controllers: [ChannelMessagesController],
  exports: [ChannelMessagesService, TypeOrmModule]
})
export class ChannelMessagesModule {}
