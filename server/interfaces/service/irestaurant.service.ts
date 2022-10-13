import { RestaurantDTO } from "../../models";

export interface IRestaurantService {
  getRestaurants(filterParams: any): Promise<RestaurantDTO[]>;
  getRestaurant(restaurantId: string): Promise<RestaurantDTO>;
  createRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO>;
  updateRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO>;
  deleteRestaurant(restaurantId: string): Promise<void>;
}
