import { Module } from '@nestjs/common';

import { ScheduleModule, Cron, CronExpression } from '@nestjs/schedule';
import { MeetingRoomsController } from './controllers/meeting-rooms.controller';
import { ReservationsController } from './controllers/reservations.controller';
import { MeetingRoomsService } from './services/meeting-rooms.service';
import { ReservationsService } from './services/reservations.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MeetingRoomsController, ReservationsController],
  providers: [MeetingRoomsService, ReservationsService],
})
export class MeetingRoomsModule {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Cron Job 을 이용해 매일 자정에 예약 초기화
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleResetReservations() {
    this.reservationsService.resetReservations();
  }
}
