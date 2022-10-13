export const TYPES = {
  AuthorizationService: Symbol("AuthorizationService"),
  UserService: Symbol("UserService"),
  RestaurantService: Symbol("RestaurantService"),
  ReviewService: Symbol("ReviewService"),
  UserRepository: Symbol("UserRepository"),
  RestaurantRepository: Symbol("RestaurantRepository"),
  ReviewRepository: Symbol("ReviewRepository"),
  VerifyTokenMiddleware: Symbol("VerifyTokenMiddleware"),
  IsAdminMiddleware: Symbol("IsAdminMiddleware"),
  IsOwnerMiddleware: Symbol("IsOwnerMiddleware"),
  IsRegularMiddleware: Symbol("IsRegularMiddleware"),
};
