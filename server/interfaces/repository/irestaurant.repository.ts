import { RestaurantDTO } from "../../models";

export interface IRestaurantRepository {
  getRestaurants(filterParams: any): Promise<RestaurantDTO[]>;
  getRestaurant(restaurantId: string): Promise<RestaurantDTO>;
  findRestaurant(name: string): Promise<RestaurantDTO | null>;
  createRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO>;
  updateRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO>;
  deleteRestaurant(restaurantId: string): Promise<void>;
}
