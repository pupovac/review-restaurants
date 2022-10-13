import { Container } from "inversify";
import { TYPES } from "./constants/types.constant";

import {
  IVerifyTokenMiddleware,
  IUserRepository,
  IUserService,
  IRestaurantService,
  IRestaurantRepository,
  IAuthorizationService,
  IIsAdminMiddleware,
  IReviewService,
  IReviewRepository,
  IIsRegularMiddleware,
  IIsOwnerMiddleware,
} from "../server/interfaces";
import { UserService, RestaurantService, AuthorizationService, ReviewService } from "../server/services";
import { IsAdminMiddleware, VerifyTokenMiddleware, IsOwnerMiddleware, IsRegularMiddleware } from "../server/middlewares";
import { UserRepository, RestaurantRepository, ReviewRepository } from "../server/repository";

export const container = new Container();

container.bind<IUserService>(TYPES.UserService).to(UserService).inTransientScope();
container.bind<IRestaurantService>(TYPES.RestaurantService).to(RestaurantService).inTransientScope();
container.bind<IAuthorizationService>(TYPES.AuthorizationService).to(AuthorizationService).inTransientScope();
container.bind<IReviewService>(TYPES.ReviewService).to(ReviewService).inTransientScope();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inTransientScope();
container.bind<IRestaurantRepository>(TYPES.RestaurantRepository).to(RestaurantRepository).inTransientScope();
container.bind<IReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository).inTransientScope();

container.bind<IVerifyTokenMiddleware>(TYPES.VerifyTokenMiddleware).to(VerifyTokenMiddleware);
container.bind<IIsAdminMiddleware>(TYPES.IsAdminMiddleware).to(IsAdminMiddleware);
container.bind<IIsOwnerMiddleware>(TYPES.IsOwnerMiddleware).to(IsOwnerMiddleware);
container.bind<IIsRegularMiddleware>(TYPES.IsRegularMiddleware).to(IsRegularMiddleware);
