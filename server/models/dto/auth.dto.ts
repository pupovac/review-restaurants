import { IsNotEmpty, IsEmail, IsEnum, IsOptional } from "class-validator";
import { ROLES } from "../../../config/constants/enum.contants";

export class AuthDTO {
  @IsNotEmpty()
  firstName!: string;
  @IsNotEmpty()
  lastName!: string;
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  password!: string;
  @IsNotEmpty()
  @IsEnum(ROLES)
  role!: string;
}
