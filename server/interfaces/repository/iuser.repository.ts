import { AuthDTO, FullUserDTO, UserDTO } from "../../models";

export interface IUserRepository {
  getUsers(filterParams: any): Promise<UserDTO[]>;
  getUser(userId: string): Promise<UserDTO>;
  findUser(email: string): Promise<FullUserDTO | null>;
  createUser(authInfo: AuthDTO): Promise<void>;
  updateUser(user: UserDTO): Promise<UserDTO>;
  deleteUser(userId: string): Promise<void>;
}
