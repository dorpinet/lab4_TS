import {
  IsInt,
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly title!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  readonly price!: number;

  @IsISBN()
  readonly isbn!: string;

  @IsInt()
  @Min(1)
  readonly pageCount!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly author!: string;
}