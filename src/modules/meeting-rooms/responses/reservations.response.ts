import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../entities/reservation.entity';

export abstract class ReservationsResponseData {
  @ApiProperty({
    type: [Reservation],
  })
  reservations: Reservation[];
}

export abstract class ReservationsResponse {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: ReservationsResponseData;
}
