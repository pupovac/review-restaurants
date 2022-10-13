import { IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { UserSubsetDTO } from "./";
import { CommentDTO } from "./comment.dto";

export class ReviewDTO {
  id: string;
  @IsNotEmpty()
  rate!: number;
  @IsNotEmpty()
  date!: Date;
  @IsNotEmpty()
  message!: string;
  @Type(() => CommentDTO)
  comments: CommentDTO[];
  @IsNotEmpty()
  restaurant!: string;
  @Type(() => UserSubsetDTO)
  createdBy: UserSubsetDTO;
  @Type(() => UserSubsetDTO)
  updatedBy: UserSubsetDTO;
  createdAt?: Date;
  updatedAt?: Date;
}
