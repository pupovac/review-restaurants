import { injectable } from "inversify";
import { errors } from "../../config/constants/error.constant";
import { IReviewRepository } from "../interfaces";
import { CommentDTO, ReviewDTO } from "../models";
import Review, { ReviewClass } from "../models/domain/review.domain";
import { ConvertToDomain, ConvertToDTO } from "../helpers";
import { mongoose } from "@typegoose/typegoose";

@injectable()
export class ReviewRepository implements IReviewRepository {
  constructor() {}
  async getReviews(filterParams: any): Promise<ReviewDTO[]> {
    try {
      let { ...query } = filterParams;
      query.$and = [];

      if (query.type === "pendingReply") {
        query.$and.push({ comments: { $eq: [] } });
      }
      delete query.type;

      if (query.$and.length === 0) delete query.$and;

      const result = await Review.find(query, null, { sort: { date: -1 } }).populate(["createdBy", "updatedBy"]);
      const reviews = ConvertToDTO.convertReviews(result);
      return reviews;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Review get", error.message));
    }
  }

  async getReviewRates(restaurantId: string): Promise<number[]> {
    const reviews = await Review.find({ restaurant: new mongoose.Types.ObjectId(restaurantId) }, { rate: 1, _id: 0 });
    return reviews.map((r) => r.rate);
  }

  async getHighestAndLowestReview(restaurantId: string): Promise<ReviewDTO[]> {
    try {
      let result: ReviewDTO[] = [];
      const highest = await Review.findOne({ restaurant: new mongoose.Types.ObjectId(restaurantId) })
        .sort("-rate")
        .populate(["createdBy", "updatedBy"]);
      const lowest = await Review.findOne({ restaurant: new mongoose.Types.ObjectId(restaurantId) })
        .sort("rate")
        .populate(["createdBy", "updatedBy"]);

      if (highest) result.push(ConvertToDTO.convertReview(highest));
      if (lowest) result.push(ConvertToDTO.convertReview(lowest));
      return result;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository get review", error.message));
    }
  }

  async getReview(reviewId: string): Promise<ReviewDTO> {
    try {
      const result = await Review.findOne({ _id: new mongoose.Types.ObjectId(reviewId) }).populate(["createdBy", "updatedBy"]);
      if (result == null) return Promise.reject(errors.resourceNotFound("Review"));
      const review = ConvertToDTO.convertReview(result);
      return review;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository get review", error.message));
    }
  }

  async createReview(review: ReviewDTO): Promise<ReviewDTO> {
    try {
      const reviewClassInstance = ConvertToDomain.convertReview(review);
      const createdReview = await Review.create(reviewClassInstance);
      const result = await Review.findOne({ _id: new mongoose.Types.ObjectId(createdReview.id) }).populate(["createdBy", "updatedBy"]);
      const reviewDTO = ConvertToDTO.convertReview(result!);
      return reviewDTO;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository create review", error.message));
    }
  }

  async updateReview(review: ReviewDTO): Promise<ReviewDTO> {
    try {
      const reviewClassInstance = ConvertToDomain.convertReview(review);
      const updatedReview = await Review.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(review.id) }, reviewClassInstance, {
        new: true,
      }).populate(["createdBy", "updatedBy"]);
      if (updatedReview == null) return Promise.reject(errors.resourceNotFound("Review"));
      const reviewDTO = ConvertToDTO.convertReview(updatedReview);
      return reviewDTO;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository update review", error.message));
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    try {
      const review = await Review.findOneAndDelete({ _id: new mongoose.Types.ObjectId(reviewId) });
      if (review == null) return Promise.reject(errors.resourceNotFound("Review"));
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository delete review", error.message));
    }
  }

  async deleteReviews(restaurantId: string): Promise<void> {
    try {
      const review = await Review.deleteMany({ restaurant: new mongoose.Types.ObjectId(restaurantId) });
      if (review == null) return Promise.reject(errors.resourceNotFound("Review"));
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository delete review", error.message));
    }
  }

  async createComment(reviewId: string, comment: CommentDTO): Promise<void> {
    try {
      const commentClassInstance = ConvertToDomain.convertComment(comment);
      const review = await Review.findOne({ _id: new mongoose.Types.ObjectId(reviewId) });
      if (review == null) return Promise.reject(errors.resourceNotFound("Review"));

      review.comments.push(commentClassInstance);
      review.save();
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository create review", error.message));
    }
  }

  async updateComment(reviewId: string, comment: CommentDTO): Promise<void> {
    try {
      const review = await Review.findOne({ _id: new mongoose.Types.ObjectId(reviewId) });
      if (review == null) return Promise.reject(errors.resourceNotFound("Review"));

      const commentIndex = review.comments.findIndex((c) => c._id.toString() == comment.id);
      review.comments[commentIndex].message = comment.message;
      review.save();
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository create review", error.message));
    }
  }

  async deleteComment(reviewId: string, commentId: string): Promise<void> {
    try {
      const review = await Review.findOne({ _id: new mongoose.Types.ObjectId(reviewId) });
      if (review == null) return Promise.reject(errors.resourceNotFound("Review"));
      review.comments = review.comments.filter((c) => c._id.toString() != commentId);
      review.save();
      return;
    } catch (error) {
      return Promise.reject(errors.operationFailed("Repository create review", error.message));
    }
  }
}
