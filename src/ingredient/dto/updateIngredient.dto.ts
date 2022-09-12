import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Unit, UNITS } from '../ingredient.model';

export default class UpdateIngredientDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsIn(UNITS)
  @IsOptional()
  unit: Unit;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount: number;
  @ApiProperty()
  @IsOptional()
  storage: ObjectId;
}
