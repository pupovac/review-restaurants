import { injectable } from "inversify";
import { errors } from "../../config/constants/error.constant";
import { IRestaurantRepository } from "../interfaces";
import { RestaurantDTO } from "../models";
import Restaurant, { RestaurantClass } from "../models/domain/restaurant.domain";
import { ConvertToDomain, ConvertToDTO } from "../helpers";
import { mongoose } from "@typegoose/typegoose";

@injectable()
export class RestaurantRepository implements IRestaurantRepository {
  constructor() {}
  async getRestaurants(filterParams: any): Promise<RestaurantDTO[]> {
    try {
      let { sortBy, ...query } = filterParams;
      const sortDirection = sortBy ? -1 : 1;
      sortBy = sortBy ? sortBy : "name";
      let sort: any = {};
      sort[sortBy] = sortDirection;

      query.$and = [];

      if (query.id) {
        query.$and.push({ _id: new mongoose.Types.ObjectId(query.id) });
        delete query.id;
      }

      if (query.owner) {
        query.$and.push({ owner: new mongoose.Types.ObjectId(query.owner) });
        delete query.owner;
      }

      if (query.rate) {
        query.$and.push({ averageRating: { $gte: +query.rate, $lte: +query.rate + 0.99 } });
        delete query.rate;
      }

      if (query.$and.length === 0) delete query.$and;

      const result = await Restaurant.find(query, null, { sort: sort }).populate(["owner", "createdBy", "updatedBy"]);
      const restaurants = ConvertToDTO.convertRestaurants(result);
      return restaurants;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Restaurant get", error.message));
    }
  }

  async getRestaurant(restaurantId: string): Promise<RestaurantDTO> {
    try {
      const result = await Restaurant.findOne({ _id: new mongoose.Types.ObjectId(restaurantId) }).populate([
        "owner",
        "createdBy",
        "updatedBy",
      ]);
      if (result == null) return Promise.reject(errors.resourceNotFound("Restaurant"));
      const restaurant = ConvertToDTO.convertRestaurant(result);
      return restaurant;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository get restaurant", error.message));
    }
  }

  async findRestaurant(name: string): Promise<RestaurantDTO | null> {
    try {
      const result = await Restaurant.findOne({ name: name });
      return result ? ConvertToDTO.convertRestaurant(result) : null;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository get restaurant", error.message));
    }
  }

  async createRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    try {
      const restaurantClassInstance = ConvertToDomain.convertRestaurant(restaurant);
      const createdRestaurant = await Restaurant.create(restaurantClassInstance);
      const restaurantDTO = ConvertToDTO.convertRestaurant(createdRestaurant);
      return restaurantDTO;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository create restaurant", error.message));
    }
  }

  async updateRestaurant(restaurant: RestaurantDTO): Promise<RestaurantDTO> {
    try {
      const restaurantClassInstance = ConvertToDomain.convertRestaurant(restaurant);
      const updatedRestaurant = await Restaurant.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(restaurant.id) },
        restaurantClassInstance,
        {
          new: true,
        },
      );
      if (updatedRestaurant == null) return Promise.reject(errors.resourceNotFound("Restaurant"));
      const restaurantDTO = ConvertToDTO.convertRestaurant(updatedRestaurant);
      return restaurantDTO;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository update restaurant", error.message));
    }
  }

  async deleteRestaurant(restaurantId: string): Promise<void> {
    try {
      const restaurant = await Restaurant.findOneAndDelete({ _id: new mongoose.Types.ObjectId(restaurantId) });
      if (restaurant == null) return Promise.reject(errors.resourceNotFound("Restaurant"));
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository delete restaurant", error.message));
    }
  }
}
