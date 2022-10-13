import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constants/types.constant";
import { IRestaurantRepository, IReviewRepository, IReviewService } from "../interfaces";
import { CommentDTO, ReviewDTO } from "../models";
import { errors } from "../../config/constants/error.constant";

@injectable()
export class ReviewService implements IReviewService {
  private reviewRepository: IReviewRepository;
  private restaurantRepository: IRestaurantRepository;
  constructor(
    @inject(TYPES.ReviewRepository) reviewRepository: IReviewRepository,
    @inject(TYPES.RestaurantRepository) restaurantRepository: IRestaurantRepository,
  ) {
    this.reviewRepository = reviewRepository;
    this.restaurantRepository = restaurantRepository;
  }

  async getReviews(filterParams: any): Promise<ReviewDTO[]> {
    const reviews = this.reviewRepository.getReviews(filterParams);
    return reviews;
  }

  async getReview(reviewId: string): Promise<ReviewDTO> {
    const review = await this.reviewRepository.getReview(reviewId);
    return review;
  }

  async createReview(review: ReviewDTO): Promise<ReviewDTO> {
    const createdReview = await this.reviewRepository.createReview(review);
    await this.updateAverageRating(review.restaurant);
    return createdReview;
  }

  async updateReview(review: ReviewDTO): Promise<ReviewDTO> {
    const updatedReview = await this.reviewRepository.updateReview(review);
    await this.updateAverageRating(review.restaurant);
    return updatedReview;
  }

  async deleteReview(reviewId: string): Promise<void> {
    const review = await this.reviewRepository.getReview(reviewId);
    await this.reviewRepository.deleteReview(reviewId);
    await this.updateAverageRating(review.restaurant);
    return;
  }

  async createComment(reviewId: string, comment: CommentDTO): Promise<void> {
    const review = await this.reviewRepository.getReview(reviewId);
    // check if user is owner of this restaurant
    const isOwnerOfRestaurant = await this.restaurantRepository.getRestaurants({ id: review.restaurant, owner: comment.createdBy.id });
    if (!isOwnerOfRestaurant) return Promise.reject(errors.operationFailed("Create comment", "The user is not owner of this restaurant."));
    // owner can leave only one replay to review
    if (review.comments.length > 0) return Promise.reject(errors.resourceAlreadyExist("Comment"));

    await this.reviewRepository.createComment(reviewId, comment);
    return;
  }

  async updateComment(reviewId: string, comment: CommentDTO): Promise<void> {
    await this.reviewRepository.updateComment(reviewId, comment);
    return;
  }

  async deleteComment(reviewId: string, commentId: string): Promise<void> {
    await this.reviewRepository.deleteComment(reviewId, commentId);
    return;
  }

  async updateAverageRating(restaurantId: string): Promise<void> {
    const restaurantDTO = await this.restaurantRepository.getRestaurant(restaurantId);
    const reviewRates = await this.reviewRepository.getReviewRates(restaurantId);
    const averageRating = this.calculateAverageRating(reviewRates);
    restaurantDTO.averageRating = averageRating;
    await this.restaurantRepository.updateRestaurant(restaurantDTO);
  }

  calculateAverageRating(reviewRates: number[]): number {
    let averageRating = 0;
    if (reviewRates.length > 0) {
      let total = reviewRates.reduce((a, b) => a + b, 0);
      averageRating = +(total / reviewRates.length).toFixed(2);
    }
    return averageRating;
  }
}
