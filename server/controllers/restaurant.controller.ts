import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces, request, response, next } from "inversify-express-utils";
import { ROLES } from "../../config/constants/enum.contants";
import { TYPES } from "../../config/constants/types.constant";
import { validateRequestBody } from "../helpers/validate-request.helper";
import { IRestaurantService } from "../interfaces";
import { RestaurantDTO } from "../models";

@controller("/restaurants", TYPES.VerifyTokenMiddleware)
export class RestaurantController implements interfaces.Controller {
  private restaurantService: IRestaurantService;

  constructor(@inject(TYPES.RestaurantService) restaurantService: IRestaurantService) {
    this.restaurantService = restaurantService;
  }

  @httpGet("/")
  public async getRestaurants(@request() req: Request, @response() res: Response): Promise<Response> {
    try {
      const filterParams = req.query;
      const isRegular: boolean = String(req.headers.role) === ROLES.regular;
      if (isRegular) filterParams["sortBy"] = "averageRating";
      const isOwner = String(req.headers.role) === ROLES.owner;
      if (isOwner) filterParams["owner"] = String(req.headers.userId);
      const restaurants = await this.restaurantService.getRestaurants(filterParams);
      return res.ok(restaurants);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPost("/", TYPES.IsOwnerMiddleware)
  public async createRestaurant(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const restaurantDTO = plainToClass(RestaurantDTO, req.body);
      await validateRequestBody(restaurantDTO);
      const restaurant = await this.restaurantService.createRestaurant(restaurantDTO);
      return res.created(restaurant);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpGet("/:id")
  public async getRestaurant(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const restaurants = await this.restaurantService.getRestaurant(<string>req.params.id);
      return res.ok(restaurants);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPut("/:id", TYPES.IsAdminMiddleware)
  public async updateRestaurant(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const restaurantDTO = plainToClass(RestaurantDTO, req.body);
      await validateRequestBody(restaurantDTO);
      const restaurants = await this.restaurantService.updateRestaurant(restaurantDTO);
      return res.ok(restaurants);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpDelete("/:id", TYPES.IsAdminMiddleware)
  public async deleteRestaurant(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      await this.restaurantService.deleteRestaurant(req.params.id);
      return res.noContent();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
