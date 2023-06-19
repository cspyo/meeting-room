export interface MeetingRoom {
  location: string;
  floor: number;
  size: MeetingRoomSize;
}

export enum MeetingRoomSize {
  SMALL = 'small',
  MIDDLE = 'middle',
  BIG = 'big',
}
