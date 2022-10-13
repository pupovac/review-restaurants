import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPut, interfaces, request, response, next } from "inversify-express-utils";
import { TYPES } from "../../config/constants/types.constant";
import { validateRequestBody } from "../helpers/validate-request.helper";
import { IUserService } from "../interfaces";
import { UserDTO } from "../models";

@controller("/users", TYPES.VerifyTokenMiddleware)
export class UserController implements interfaces.Controller {
  private userService: IUserService;

  constructor(@inject(TYPES.UserService) userService: IUserService) {
    this.userService = userService;
  }

  @httpGet("/", TYPES.IsAdminMiddleware)
  public async getUsers(@request() req: Request, @response() res: Response): Promise<Response> {
    try {
      const filterParams = req.query;
      const users = await this.userService.getUsers(filterParams);
      return res.ok(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPut("/:id", TYPES.IsAdminMiddleware)
  public async updateUser(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const userDTO = plainToClass(UserDTO, req.body);
      await validateRequestBody(userDTO);
      const users = await this.userService.updateUser(userDTO);
      return res.ok(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpDelete("/:id", TYPES.IsAdminMiddleware)
  public async deleteUser(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      await this.userService.deleteUser(req.params.id);
      return res.noContent();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
