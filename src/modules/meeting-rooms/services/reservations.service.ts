import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { Reservation } from '../entities/reservation.entity';
import { nanoid } from 'nanoid';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { MeetingRoom } from '../entities/meeting-room.entity';
import { UpdateReservationDto } from '../dtos/update-reservation.dto';

@Injectable()
export class ReservationsService {
  private reservations: Map<string, Reservation>;

  constructor(
    @Inject(MeetingRoomsService)
    private readonly meetingRoomsService: MeetingRoomsService,
  ) {
    this.reservations = new Map();
  }

  getAllReservations(): Reservation[] {
    return Array.from(this.reservations.values());
  }

  findReservationById(id: string): Reservation {
    const reservation = this.reservations.get(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }
    return reservation;
  }

  createReservation(createReservationDto: CreateReservationDto) {
    const { userId, meetingRoomLocation, startTime, endTime } =
      createReservationDto;

    if (this.isOutOfReservationTimeRange(startTime, endTime)) {
      throw new BadRequestException(`The reservation time is out of range`);
    }

    if (this.hasExceededTotalReservationTime(userId, startTime, endTime)) {
      throw new BadRequestException(
        `The user has exceeded the maximum reservation hours per day`,
      );
    }

    if (
      this.isReservationTimeConflict(meetingRoomLocation, startTime, endTime)
    ) {
      throw new BadRequestException(
        `The reservation time is conflict with same location meeting room`,
      );
    }

    const meetingRoom: MeetingRoom =
      this.meetingRoomsService.findMeetingRoomByLocation(meetingRoomLocation);

    try {
      const newReservation: Reservation = {
        id: nanoid(),
        userId,
        meetingRoomLocation,
        startTime,
        endTime,
      };
      this.reservations.set(newReservation.id, newReservation);

      return newReservation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  updateReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Reservation {
    const { userId, meetingRoomLocation, startTime, endTime } =
      updateReservationDto;
    const reservation = this.findReservationById(id);

    const updateUserId = userId ?? reservation.userId;
    const updateMeetingRoomLocation =
      meetingRoomLocation ?? reservation.meetingRoomLocation;
    const updateStartTime = startTime ?? reservation.startTime;
    const updateEndTime = endTime ?? reservation.endTime;

    if (this.isOutOfReservationTimeRange(updateStartTime, updateEndTime)) {
      throw new BadRequestException(`The reservation time is out of range`);
    }

    if (
      this.hasExceededTotalReservationTime(
        updateUserId,
        updateStartTime,
        updateEndTime - (reservation.endTime - reservation.startTime),
      )
    ) {
      throw new BadRequestException(
        `The user has exceeded the maximum reservation hours per day`,
      );
    }

    if (updateMeetingRoomLocation != reservation.meetingRoomLocation) {
      if (
        this.isReservationTimeConflict(
          updateMeetingRoomLocation,
          updateStartTime,
          updateEndTime,
        )
      ) {
        throw new BadRequestException(
          `The reservation time is conflict with same location meeting room`,
        );
      }
    }

    try {
      reservation.userId = updateUserId;
      reservation.meetingRoomLocation = updateMeetingRoomLocation;
      reservation.startTime = updateStartTime;
      reservation.endTime = updateEndTime;

      return reservation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  deleteReservation(id: string) {
    const reservation = this.findReservationById(id);
    try {
      this.reservations.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  resetReservations() {
    this.reservations.clear();
  }

  private isOutOfReservationTimeRange(
    startTime: number,
    endTime: number,
  ): boolean {
    return startTime < 9 || startTime > 17 || endTime < 10 || endTime > 18;
  }

  private getHoursDifference(startTime: number, endTime: number): number {
    return endTime - startTime;
  }

  private hasExceededTotalReservationTime(
    userId: string,
    startTime: number,
    endTime: number,
  ): boolean {
    const existingReservations = Array.from(this.reservations.values()).filter(
      (reservation) => reservation.userId === userId,
    );
    const totalReservedHours = existingReservations.reduce(
      (total, reservation) => {
        return (
          total +
          this.getHoursDifference(reservation.startTime, reservation.endTime)
        );
      },
      0,
    );
    const requestedHours = this.getHoursDifference(startTime, endTime);

    return totalReservedHours + requestedHours > 6;
  }

  private isReservationTimeConflict(
    meetingRoomLocation: string,
    startTime: number,
    endTime: number,
  ) {
    const sameLocationReservations = Array.from(
      this.reservations.values(),
    ).filter(
      (reservation) => reservation.meetingRoomLocation === meetingRoomLocation,
    );
    for (const reservation of sameLocationReservations) {
      if (
        (startTime >= reservation.startTime &&
          startTime < reservation.endTime) ||
        (endTime > reservation.startTime && endTime <= reservation.endTime) ||
        (startTime <= reservation.startTime && endTime >= reservation.endTime)
      ) {
        return true;
      }
    }
    return false;
  }
}
