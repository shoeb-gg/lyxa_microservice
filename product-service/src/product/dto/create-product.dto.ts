import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  count: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
