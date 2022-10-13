import { CommentDTO, ReviewDTO } from "../../models";

export interface IReviewRepository {
  getReviews(filterParams: any): Promise<ReviewDTO[]>;
  getReviewRates(restaurantId: string): Promise<number[]>;
  getHighestAndLowestReview(restaurantId: string): Promise<ReviewDTO[]>;
  getReview(reviewId: string): Promise<ReviewDTO>;
  createReview(review: ReviewDTO): Promise<ReviewDTO>;
  updateReview(review: ReviewDTO): Promise<ReviewDTO>;
  deleteReviews(restaurantId: string): Promise<void>;
  deleteReview(reviewId: string): Promise<void>;
  createComment(reviewId: string, comment: CommentDTO): Promise<void>;
  updateComment(reviewId: string, comment: CommentDTO): Promise<void>;
  deleteComment(reviewId: string, commentId: string): Promise<void>;
}
