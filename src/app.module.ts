import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MeetingRoomsModule } from './modules/meeting-rooms/meeting-rooms.module';

@Module({
  imports: [UsersModule, MeetingRoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
