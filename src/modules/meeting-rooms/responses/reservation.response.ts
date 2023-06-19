import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../entities/reservation.entity';

export abstract class ReservationResponseData {
  @ApiProperty()
  reservation: Reservation;
}

export abstract class ReservationResponse {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: ReservationResponseData;
}
