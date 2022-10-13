import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constants/types.constant";
import { IRestaurantRepository, IUserRepository, IUserService } from "../interfaces";
import { UserDTO } from "../models";
import { errors } from "../../config/constants/error.constant";
import { ROLES } from "../../config/constants/enum.contants";

@injectable()
export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private restaurantRepository: IRestaurantRepository;
  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.RestaurantRepository) restaurantRepository: IRestaurantRepository,
  ) {
    this.userRepository = userRepository;
    this.restaurantRepository = restaurantRepository;
  }

  async getUsers(filterParams: any): Promise<UserDTO[]> {
    const users = this.userRepository.getUsers(filterParams);
    return users;
  }

  async updateUser(user: UserDTO): Promise<UserDTO> {
    // check if user with the same email already exist
    const existingUser = await this.userRepository.findUser(user.email);
    if (existingUser && existingUser.id !== user.id) return Promise.reject(errors.resourceAlreadyExist("Email"));

    // user with role OWNER and as a owner of restaurant can not change his role because restaurant will end up without owner
    const isOwnerOfRestaurant = await this.restaurantRepository.getRestaurants({ owner: user.id });
    if (existingUser && existingUser.role === ROLES.owner && user.role !== ROLES.owner && isOwnerOfRestaurant.length > 0)
      return Promise.reject(errors.operationFailed("Update user", "The user is owner of restaurant, you can not change his role."));

    const updatedUser = await this.userRepository.updateUser(user);
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.getUser(userId);
    // owner of restaurant can not be deleted
    const isOwnerOfRestaurant = await this.restaurantRepository.getRestaurants({ owner: user.id });
    if (user.role === ROLES.owner && isOwnerOfRestaurant.length > 0)
      return Promise.reject(errors.operationFailed("Delete user", "The user is owner of restaurant, you can not delete him."));

    await this.userRepository.deleteUser(userId);
    return;
  }
}
