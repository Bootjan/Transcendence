import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessage } from './models/direct_message.entity';
import { DirectMessagesService } from './direct_messages.service';
import { DirectMessagesController } from './direct_messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DirectMessage])],
  providers: [DirectMessagesService],
  controllers: [DirectMessagesController],
  exports: [DirectMessagesService, TypeOrmModule]
})
export class DirectMessagesModule {}
