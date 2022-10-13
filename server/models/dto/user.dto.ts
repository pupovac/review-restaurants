import { IsNotEmpty, IsEmail, IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { UserSubsetDTO } from "./";
import { ROLES } from "../../../config/constants/enum.contants";

export class UserDTO {
  id: string;
  @IsNotEmpty()
  firstName!: string;
  @IsNotEmpty()
  lastName!: string;
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @IsEnum(ROLES)
  role!: string;
  @IsOptional()
  accessToken: string;
  @Type(() => UserSubsetDTO)
  updatedBy: UserSubsetDTO;
  createdAt?: Date;
  updatedAt?: Date;
}
