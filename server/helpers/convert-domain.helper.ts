import { AuthDTO, RestaurantDTO, ReviewDTO, UserDTO, CommentDTO } from "../models";
import { CommentClass, RestaurantClass, ReviewClass, UserClass } from "../models/domain";
import mongoose from "mongoose";

export class ConvertToDomain {
  static convertRestaurants(restaurants: RestaurantDTO[]): RestaurantClass[] {
    return restaurants.map((restaurant) => ConvertToDomain.convertRestaurant(restaurant));
  }

  static convertRestaurant(restaurant: RestaurantDTO): RestaurantClass {
    let result = new RestaurantClass();
    if (restaurant.id == null) {
      result._id = new mongoose.Types.ObjectId();
    } else {
      result._id = new mongoose.Types.ObjectId(restaurant.id);
    }
    if (restaurant.name != undefined) result.name = restaurant.name;
    if (restaurant.address != undefined) result.address = restaurant.address;
    if (restaurant.phone != undefined) result.phone = restaurant.phone;
    if (restaurant.owner.id != undefined) {
      result.owner = new mongoose.Types.ObjectId(restaurant.owner.id);
    } else if (restaurant.owner != undefined) result.owner = new mongoose.Types.ObjectId(<any>restaurant.owner);
    if (restaurant.averageRating != undefined) result.averageRating = restaurant.averageRating;
    if (restaurant.createdBy != undefined) result.createdBy = new mongoose.Types.ObjectId(restaurant.createdBy.id);
    if (restaurant.updatedBy != undefined) result.updatedBy = new mongoose.Types.ObjectId(restaurant.updatedBy.id);
    if (restaurant.createdAt != undefined) result.createdAt = restaurant.createdAt;
    if (restaurant.updatedAt != undefined) result.updatedAt = restaurant.updatedAt;
    return result;
  }

  static convertReviews(reviews: ReviewDTO[]): ReviewClass[] {
    return reviews.map((review) => ConvertToDomain.convertReview(review));
  }

  static convertReview(review: ReviewDTO): ReviewClass {
    let result = new ReviewClass();
    if (review.id == null) {
      result._id = new mongoose.Types.ObjectId();
    } else {
      result._id = new mongoose.Types.ObjectId(review.id);
    }
    if (review.rate != undefined) result.rate = review.rate;
    if (review.date != undefined) result.date = review.date;
    if (review.message != undefined) result.message = review.message;
    if (review.comments != undefined) result.comments = this.convertComments(review.comments);
    if (review.restaurant != undefined) result.restaurant = new mongoose.Types.ObjectId(review.restaurant);
    if (review.createdBy != undefined) result.createdBy = new mongoose.Types.ObjectId(review.createdBy.id);
    if (review.updatedBy != undefined) result.updatedBy = new mongoose.Types.ObjectId(review.updatedBy.id);
    if (review.createdAt != undefined) result.createdAt = review.createdAt;
    if (review.updatedAt != undefined) result.updatedAt = review.updatedAt;
    return result;
  }

  static convertComments(comments: CommentDTO[]): CommentClass[] {
    return comments.map((comment) => ConvertToDomain.convertComment(comment));
  }

  static convertComment(comment: CommentDTO): CommentClass {
    let result = new CommentClass();
    if (comment.id == null) {
      result._id = new mongoose.Types.ObjectId();
    } else {
      result._id = new mongoose.Types.ObjectId(comment.id);
    }
    if (comment.message != undefined) result.message = comment.message;
    if (comment.role != undefined) result.role = comment.role;
    if (comment.createdBy != undefined) result.createdBy = new mongoose.Types.ObjectId(comment.createdBy.id);
    if (comment.updatedBy != undefined) result.updatedBy = new mongoose.Types.ObjectId(comment.updatedBy.id);
    if (comment.createdAt != undefined) result.createdAt = comment.createdAt;
    if (comment.updatedAt != undefined) result.updatedAt = comment.updatedAt;
    return result;
  }

  static convertUsers(users: UserDTO[]): UserClass[] {
    return users.map((user) => ConvertToDomain.convertUser(user));
  }

  static convertUser(user: UserDTO): UserClass {
    let result = new UserClass();
    if (user.id == null) {
      result._id = new mongoose.Types.ObjectId();
    } else {
      result._id = new mongoose.Types.ObjectId(user.id);
    }
    if (user.firstName != undefined) result.firstName = user.firstName;
    if (user.lastName != undefined) result.lastName = user.lastName;
    if (user.email != undefined) result.email = user.email;
    if (user.role != undefined) result.role = user.role;
    if (user.updatedBy != undefined) result.updatedBy = new mongoose.Types.ObjectId(user.updatedBy.id);
    if (user.createdAt != undefined) result.createdAt = user.createdAt;
    if (user.updatedAt != undefined) result.updatedAt = user.updatedAt;
    return result;
  }

  static convertAuthInfo(authInfo: AuthDTO): UserClass {
    let result = new UserClass();
    result._id = new mongoose.Types.ObjectId();
    if (authInfo.firstName != undefined) result.firstName = authInfo.firstName;
    if (authInfo.lastName != undefined) result.lastName = authInfo.lastName;
    if (authInfo.email != undefined) result.email = authInfo.email;
    if (authInfo.password != undefined) result.password = authInfo.password;
    if (authInfo.role != undefined) result.role = authInfo.role;
    return result;
  }
}
