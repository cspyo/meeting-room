import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { UpdateReservationDto } from '../dtos/update-reservation.dto';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ReservationsResponse } from '../responses/reservations.response';
import { ReservationResponse } from '../responses/reservation.response';
import { BadRequestResponse } from '../responses/bad-request.response';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    @Inject(ReservationsService)
    private readonly reservationService: ReservationsService,
  ) {}

  @ApiOkResponse({
    description: 'Success',
    type: ReservationsResponse,
  })
  @ApiOperation({ summary: '모든 예약 정보 가져오기' })
  @Get()
  async getAllReservations() {
    const reservations = this.reservationService.getAllReservations();
    return {
      code: 200,
      message: 'Find All Reservations',
      data: { reservations: reservations },
    };
  }

  @ApiNotFoundResponse({ description: 'Reservation not found' })
  @ApiOkResponse({
    description: 'Success',
    type: ReservationResponse,
  })
  @ApiOperation({ summary: 'ID 로 예약 정보 가져오기' })
  @Get(':id')
  async getReservationById(@Param('id') id: string) {
    const reservation = this.reservationService.findReservationById(id);
    return {
      code: 200,
      message: 'Find Reservation Success',
      data: { reservation: reservation },
    };
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BadRequestResponse,
  })
  @ApiNotFoundResponse({ description: 'Reservation not found' })
  @ApiCreatedResponse({
    description: 'Success',
    type: ReservationResponse,
  })
  @ApiOperation({ summary: '예약 생성' })
  @Post()
  createReservation(@Body() createReservationDto: CreateReservationDto) {
    const createdReservation =
      this.reservationService.createReservation(createReservationDto);
    return {
      code: 201,
      message: 'Create Reservation Success',
      data: { reservation: createdReservation },
    };
  }

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BadRequestResponse,
  })
  @ApiNotFoundResponse({ description: 'Reservation not found' })
  @ApiOkResponse({
    description: 'Success',
    type: ReservationResponse,
  })
  @ApiOperation({ summary: '예약 업데이트' })
  @Put(':id')
  updateReservation(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const updatedReservation = this.reservationService.updateReservation(
      id,
      updateReservationDto,
    );
    return {
      code: 200,
      message: 'Update Reservation Success',
      data: { reservation: updatedReservation },
    };
  }

  @ApiNotFoundResponse({ description: 'Reservation not found' })
  @ApiOkResponse({ description: 'Success' })
  @ApiOperation({ summary: 'ID 로 예약 삭제' })
  @Delete(':id')
  deleteReservation(@Param('id') id: string) {
    return this.reservationService.deleteReservation(id);
  }
}
