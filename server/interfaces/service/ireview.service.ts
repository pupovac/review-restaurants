import { CommentDTO, ReviewDTO } from "../../models";

export interface IReviewService {
  getReviews(filterParams: any): Promise<ReviewDTO[]>;
  getReview(reviewId: string): Promise<ReviewDTO>;
  createReview(review: ReviewDTO): Promise<ReviewDTO>;
  updateReview(review: ReviewDTO): Promise<ReviewDTO>;
  deleteReview(reviewId: string): Promise<void>;
  createComment(reviewId: string, comment: CommentDTO): Promise<void>;
  updateComment(reviewId: string, comment: CommentDTO): Promise<void>;
  deleteComment(reviewId: string, commentId: string): Promise<void>;
}
