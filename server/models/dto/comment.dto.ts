import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { UserSubsetDTO } from "./user-subset.dto";

export class CommentDTO {
  id: string;
  @IsNotEmpty()
  message!: string;
  @IsNotEmpty()
  role!: string;
  @Type(() => UserSubsetDTO)
  createdBy: UserSubsetDTO;
  createdAt?: Date;
  @Type(() => UserSubsetDTO)
  updatedBy: UserSubsetDTO;
  updatedAt?: Date;
}
