import { ApiProperty } from '@nestjs/swagger';

export abstract class BadRequestResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;
}
