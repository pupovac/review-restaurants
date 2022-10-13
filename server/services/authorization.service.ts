import { injectable, inject } from "inversify";
import { errors } from "../../config/constants/error.constant";
import { TYPES } from "../../config/constants/types.constant";
import { IAuthorizationService, IUserRepository } from "../interfaces";
import { AuthDTO, LoginDTO, UserDTO } from "../models";
import { UserRepository } from "../repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AUTH } from "../../config/constants/auth.constant";
import { ConvertToDTO } from "../helpers";

@injectable()
export class AuthorizationService implements IAuthorizationService {
  private userRepository: IUserRepository;
  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signup(authInfo: AuthDTO): Promise<void> {
    const userExist = await this.userRepository.findUser(authInfo.email);
    if (userExist) return Promise.reject(errors.resourceAlreadyExist("Email"));

    const hashPassword = bcrypt.hashSync(authInfo.password, 10);
    authInfo.password = hashPassword;

    await this.userRepository.createUser(authInfo);
    return;
  }

  async login(loginInfo: LoginDTO): Promise<UserDTO> {
    const userExist = await this.userRepository.findUser(loginInfo.email);
    if (!userExist) return Promise.reject(errors.resourceNotFound("User"));

    const validPassword = bcrypt.compareSync(loginInfo.password, userExist!.password);
    if (!validPassword) return Promise.reject(errors.unauthorized("Invalid password."));

    const tokenInfo = {
      id: userExist!.id,
      firstName: userExist!.firstName,
      lastName: userExist!.lastName,
      email: userExist!.email,
      role: userExist!.role,
    };

    const token = jwt.sign(tokenInfo, AUTH.secret, { expiresIn: 86400 });
    const userDTO = ConvertToDTO.convertUserWithoutPassword(userExist!, token);
    return userDTO;
  }
}
