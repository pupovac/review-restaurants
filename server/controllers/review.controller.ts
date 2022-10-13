import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces, request, response, next } from "inversify-express-utils";
import { TYPES } from "../../config/constants/types.constant";
import { validateRequestBody } from "../helpers/validate-request.helper";
import { IReviewService } from "../interfaces";
import { CommentDTO, ReviewDTO } from "../models";

@controller("/reviews", TYPES.VerifyTokenMiddleware)
export class ReviewController implements interfaces.Controller {
  private reviewService: IReviewService;

  constructor(@inject(TYPES.ReviewService) reviewService: IReviewService) {
    this.reviewService = reviewService;
  }

  @httpGet("/")
  public async getReviews(@request() req: Request, @response() res: Response): Promise<Response> {
    try {
      const filterParams = req.query;
      const reviews = await this.reviewService.getReviews(filterParams);
      return res.ok(reviews);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPost("/", TYPES.IsRegularMiddleware)
  public async createReview(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const reviewDTO = plainToClass(ReviewDTO, req.body);
      await validateRequestBody(reviewDTO);
      const review = await this.reviewService.createReview(reviewDTO);
      return res.created(review);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpGet("/:id")
  public async getReview(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const reviews = await this.reviewService.getReview(<string>req.params.id);
      return res.ok(reviews);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPut("/:id", TYPES.IsAdminMiddleware)
  public async updateReview(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const reviewDTO = plainToClass(ReviewDTO, req.body);
      await validateRequestBody(reviewDTO);
      const reviews = await this.reviewService.updateReview(reviewDTO);
      return res.ok(reviews);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpDelete("/:id", TYPES.IsAdminMiddleware)
  public async deleteReview(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      await this.reviewService.deleteReview(req.params.id);
      return res.noContent();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPost("/:id/comments", TYPES.IsOwnerMiddleware)
  public async createComment(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const reviewId = String(req.params.id);
      req.body.role = String(req.headers.role);
      const commentDTO = plainToClass(CommentDTO, req.body);
      await validateRequestBody(commentDTO);
      await this.reviewService.createComment(reviewId, commentDTO);
      return res.created();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPut("/:id/comments/:comment_id", TYPES.IsAdminMiddleware)
  public async editComment(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const reviewId = String(req.params.id);
      const commentId = String(req.params.comment_id);
      const commentDTO = plainToClass(CommentDTO, req.body);
      commentDTO.id = commentId;
      await validateRequestBody(commentDTO);
      await this.reviewService.updateComment(reviewId, commentDTO);
      return res.ok();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpDelete("/:id/comments/:comment_id", TYPES.IsAdminMiddleware)
  public async deleteComment(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const reviewId = String(req.params.id);
      const commentId = String(req.params.comment_id);
      await this.reviewService.deleteComment(reviewId, commentId);
      return res.ok();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
