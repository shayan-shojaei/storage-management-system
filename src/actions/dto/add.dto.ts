import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Unit, UNITS } from '../../ingredient/ingredient.model';

export default class AddDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(UNITS)
  unit: Unit;
}
