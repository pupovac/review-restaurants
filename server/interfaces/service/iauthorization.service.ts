import { AuthDTO, LoginDTO, UserDTO } from "../../models";

export interface IAuthorizationService {
  signup(authInfo: AuthDTO): Promise<void>;
  login(loginInfo: LoginDTO): Promise<UserDTO>;
}
