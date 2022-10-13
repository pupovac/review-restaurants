import { injectable } from "inversify";
import { errors } from "../../config/constants/error.constant";
import { IUserRepository } from "../interfaces";
import { AuthDTO, FullUserDTO, UserDTO } from "../models";
import User, { UserClass } from "../models/domain/user.domain";
import { ConvertToDomain, ConvertToDTO } from "../helpers";
import { mongoose } from "@typegoose/typegoose";

@injectable()
export class UserRepository implements IUserRepository {
  constructor() {}
  async getUsers(filterParams: any): Promise<UserDTO[]> {
    try {
      const result = await User.find({ ...filterParams }).populate(["updatedBy"]);
      const users = ConvertToDTO.convertUsers(result);
      return users;
    } catch (error) {
      return Promise.reject(errors.operationFailed("User get", error.message));
    }
  }

  async getUser(userId: string): Promise<UserDTO> {
    try {
      const result = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
      if (result == null) return Promise.reject(errors.resourceNotFound("User"));
      const user = ConvertToDTO.convertUser(result);
      return user;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository get user", error.message));
    }
  }

  async findUser(email: string): Promise<FullUserDTO | null> {
    try {
      const result = await User.findOne({ email: email });
      return result ? ConvertToDTO.convertFullUser(result) : null;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository get user", error.message));
    }
  }

  async createUser(authInfo: AuthDTO): Promise<void> {
    try {
      const userClassInstance = ConvertToDomain.convertAuthInfo(authInfo);
      await User.create(userClassInstance);
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository create user", error.message));
    }
  }

  async updateUser(user: UserDTO): Promise<UserDTO> {
    try {
      const userClassInstance = ConvertToDomain.convertUser(user);
      const updatedUser = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(user.id) }, userClassInstance, {
        new: true,
      });
      if (updatedUser == null) return Promise.reject(errors.resourceNotFound("User"));
      const userDTO = ConvertToDTO.convertUser(updatedUser);
      return userDTO;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository update user", error.message));
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await User.findOneAndDelete({ _id: new mongoose.Types.ObjectId(userId) });
      if (user == null) return Promise.reject(errors.resourceNotFound("User"));
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository delete user", error.message));
    }
  }
}
