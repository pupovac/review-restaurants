import { UserDTO } from "../../models";

export interface IUserService {
  getUsers(filterParams: any): Promise<UserDTO[]>;
  updateUser(user: UserDTO): Promise<UserDTO>;
  deleteUser(userId: string): Promise<void>;
}
