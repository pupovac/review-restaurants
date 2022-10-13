import { IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { UserSubsetDTO } from "./";
import { ReviewDTO } from "./review.dto";

export class RestaurantDTO {
  id!: string;
  @IsNotEmpty()
  name!: string;
  @IsOptional()
  address: string;
  @IsOptional()
  phone: string;
  @IsNotEmpty()
  owner!: UserSubsetDTO;
  @IsOptional()
  averageRating: number;
  highestReview?: ReviewDTO | null;
  lowestReview?: ReviewDTO | null;
  @Type(() => UserSubsetDTO)
  createdBy: UserSubsetDTO;
  @Type(() => UserSubsetDTO)
  updatedBy: UserSubsetDTO;
  createdAt?: Date;
  updatedAt?: Date;
}
