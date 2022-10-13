import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constants/types.constant";
import { IRestaurantRepository, IRestaurantService, IReviewRepository } from "../interfaces";
import { RestaurantDTO } from "../models";
import { errors } from "../../config/constants/error.constant";

@injectable()
export class RestaurantService implements IRestaurantService {
  private restaurantRepository: IRestaurantRepository;
  private reviewRepository: IReviewRepository;
  constructor(
    @inject(TYPES.RestaurantRepository) restaurantRepository: IRestaurantRepository,
    @inject(TYPES.ReviewRepository) reviewRepository: IReviewRepository,
  ) {
    this.restaurantRepository = restaurantRepository;
    this.reviewRepository = reviewRepository;
  }

  async getRestaurants(filterParams: any): Promise<RestaurantDTO[]> {
    const restaurants = this.restaurantRepository.getRestaurants(filterParams);
    return restaurants;
  }

  async getRestaurant(restaurantId: string): Promise<RestaurantDTO> {
    let restaurant = await this.restaurantRepository.getRestaurant(restaurantId);

    const reviews = await this.reviewRepository.getHighestAndLowestReview(restaurantId);
    restaurant.highestReview = reviews.length == 0 ? null : reviews[0];
    restaurant.lowestReview = reviews.length == 0 ? null : reviews.length == 1 ? reviews[0] : reviews[1];
    return restaurant;
  }

  async createRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    // check if restaurant name is already in use
    const restaurantWithSameName = await this.restaurantRepository.findRestaurant(restaurant.name);
    if (restaurantWithSameName) return Promise.reject(errors.resourceAlreadyExist("Restaurant with this name"));

    const createdRestaurant = await this.restaurantRepository.createRestaurant(restaurant);
    return createdRestaurant;
  }

  async updateRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    // check if restaurant name is already in use
    const restaurantWithSameName = await this.restaurantRepository.findRestaurant(restaurant.name);
    if (restaurantWithSameName && restaurantWithSameName.id !== restaurant.id)
      return Promise.reject(errors.resourceAlreadyExist("Restaurant with this name"));

    const updatedRestaurant = await this.restaurantRepository.updateRestaurant(restaurant);
    return updatedRestaurant;
  }

  async deleteRestaurant(restaurantId: string): Promise<void> {
    await this.reviewRepository.deleteReviews(restaurantId);
    await this.restaurantRepository.deleteRestaurant(restaurantId);
    return;
  }
}
