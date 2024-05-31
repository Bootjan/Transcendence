import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendRequest } from './models/friend_request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest])
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService, TypeOrmModule],
})
export class FriendsModule {}
