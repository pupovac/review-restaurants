import { CommentClass, RestaurantClass, ReviewClass, UserClass } from "../models/domain";
import { CommentDTO, FullUserDTO, RestaurantDTO, ReviewDTO, UserDTO, UserSubsetDTO } from "../models";

export class ConvertToDTO {
  static convertRestaurants(restaurants: RestaurantClass[]): RestaurantDTO[] {
    return restaurants.map((restaurant) => ConvertToDTO.convertRestaurant(restaurant));
  }

  static convertRestaurant(restaurant: RestaurantClass): RestaurantDTO {
    let result = new RestaurantDTO();
    if (restaurant._id != undefined) result.id = restaurant._id.toString();
    if (restaurant.name != undefined) result.name = restaurant.name;
    if (restaurant.address != undefined) result.address = restaurant.address;
    if (restaurant.phone != undefined) result.phone = restaurant.phone;
    if (restaurant.owner != undefined) result.owner = ConvertToDTO.convertUserSubset(restaurant.owner as UserClass);
    if (restaurant.averageRating != undefined) result.averageRating = restaurant.averageRating;
    if (restaurant.createdBy != undefined) result.createdBy = ConvertToDTO.convertUserSubset(restaurant.createdBy as UserClass);
    if (restaurant.updatedBy != undefined) result.updatedBy = ConvertToDTO.convertUserSubset(restaurant.updatedBy as UserClass);
    if (restaurant.createdAt != undefined) result.createdAt = restaurant.createdAt;
    if (restaurant.updatedAt != undefined) result.updatedAt = restaurant.updatedAt;
    return result;
  }

  static convertReviews(reviews: ReviewClass[]): ReviewDTO[] {
    return reviews.map((review) => ConvertToDTO.convertReview(review));
  }

  static convertReview(review: ReviewClass): ReviewDTO {
    let result = new ReviewDTO();
    if (review._id != undefined) result.id = review._id.toString();
    if (review.rate != undefined) result.rate = review.rate;
    if (review.date != undefined) result.date = review.date;
    if (review.message != undefined) result.message = review.message;
    if (review.comments != undefined) result.comments = this.convertComments(review.comments);
    if (review.restaurant != undefined) result.restaurant = review.restaurant.toString();
    if (review.createdBy != undefined) result.createdBy = ConvertToDTO.convertUserSubset(review.createdBy as UserClass);
    if (review.updatedBy != undefined) result.updatedBy = ConvertToDTO.convertUserSubset(review.updatedBy as UserClass);
    if (review.createdAt != undefined) result.createdAt = review.createdAt;
    if (review.updatedAt != undefined) result.updatedAt = review.updatedAt;
    return result;
  }

  static convertComments(comments: CommentClass[]): CommentDTO[] {
    return comments.map((comment) => ConvertToDTO.convertComment(comment));
  }

  static convertComment(comment: CommentClass): CommentDTO {
    let result = new CommentDTO();
    if (comment._id != undefined) result.id = comment._id.toString();
    if (comment.message != undefined) result.message = comment.message;
    if (comment.role != undefined) result.role = comment.role;
    if (comment.message != undefined) result.message = comment.message;
    if (comment.createdBy != undefined) result.createdBy = ConvertToDTO.convertUserSubset(comment.createdBy as UserClass);
    if (comment.updatedBy != undefined) result.updatedBy = ConvertToDTO.convertUserSubset(comment.updatedBy as UserClass);
    if (comment.createdAt != undefined) result.createdAt = comment.createdAt;
    if (comment.updatedAt != undefined) result.updatedAt = comment.updatedAt;
    return result;
  }

  static convertUsers(users: UserClass[]): UserDTO[] {
    return users.map((user) => ConvertToDTO.convertUser(user));
  }

  static convertUser(user: UserClass, token?: string): UserDTO {
    let result = new UserDTO();
    if (user._id != undefined) result.id = user._id.toString();
    if (user.firstName != undefined) result.firstName = user.firstName;
    if (user.lastName != undefined) result.lastName = user.lastName;
    if (user.email != undefined) result.email = user.email;
    if (user.role != undefined) result.role = user.role;
    if (token) result.accessToken = token;
    if (user.updatedBy != undefined) result.updatedBy = ConvertToDTO.convertUserSubset(user.updatedBy as UserClass);
    if (user.createdAt != undefined) result.createdAt = user.createdAt;
    if (user.updatedAt != undefined) result.updatedAt = user.updatedAt;
    return result;
  }

  static convertUserWithoutPassword(user: FullUserDTO, token?: string): UserDTO {
    let result = new UserDTO();
    if (user.id != undefined) result.id = user.id;
    if (user.firstName != undefined) result.firstName = user.firstName;
    if (user.lastName != undefined) result.lastName = user.lastName;
    if (user.email != undefined) result.email = user.email;
    if (user.role != undefined) result.role = user.role;
    if (token) result.accessToken = token;
    if (user.updatedBy != undefined) result.updatedBy = user.updatedBy;
    if (user.createdAt != undefined) result.createdAt = user.createdAt;
    if (user.updatedAt != undefined) result.updatedAt = user.updatedAt;
    return result;
  }

  static convertFullUser(user: UserClass, token?: string): FullUserDTO {
    let result = new FullUserDTO();
    if (user._id != undefined) result.id = user._id.toString();
    if (user.firstName != undefined) result.firstName = user.firstName;
    if (user.lastName != undefined) result.lastName = user.lastName;
    if (user.email != undefined) result.email = user.email;
    if (user.password != undefined) result.password = user.password;
    if (user.role != undefined) result.role = user.role;
    if (token) result.accessToken = token;
    if (user.updatedBy != undefined) result.updatedBy = ConvertToDTO.convertUserSubset(user.updatedBy as UserClass);
    if (user.createdAt != undefined) result.createdAt = user.createdAt;
    if (user.updatedAt != undefined) result.updatedAt = user.updatedAt;
    return result;
  }

  static convertUserSubset(user: UserClass): UserSubsetDTO {
    let result = new UserSubsetDTO();
    if (user._id != undefined) result.id = user._id.toString();
    if (user.firstName != undefined && user.lastName != undefined) result.fullName = `${user.firstName} ${user.lastName}`;
    return result;
  }
}
