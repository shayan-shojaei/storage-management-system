import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Unit } from '../ingredient.model';

export default class UpdateIngredientDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsIn(['KG', 'G', 'L', 'ML', 'M', 'CM'])
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
