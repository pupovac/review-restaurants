import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, interfaces, request, response, next } from "inversify-express-utils";
import { validateRequestBody } from "../helpers/validate-request.helper";
import { TYPES } from "../../config/constants/types.constant";
import { IAuthorizationService } from "../interfaces";
import { AuthDTO, LoginDTO } from "../models";
import { ROLES } from "../../config/constants/enum.contants";

@controller("/auth")
export class AuthorizationController implements interfaces.Controller {
  private authService: IAuthorizationService;

  constructor(@inject(TYPES.AuthorizationService) authService: IAuthorizationService) {
    this.authService = authService;
  }

  @httpPost("/register")
  public async signup(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      req.body.role = req.body.role === "restaurant owner" ? ROLES.owner : req.body.role === "reviewer" ? ROLES.regular : null;
      const authDTO = plainToClass(AuthDTO, req.body);
      await validateRequestBody(authDTO);
      await this.authService.signup(authDTO);
      return res.ok();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @httpPost("/login")
  public async login(@request() req: Request, @response() res: Response, @next() next: NextFunction): Promise<Response> {
    try {
      const loginDTO = plainToClass(LoginDTO, req.body);
      await validateRequestBody(loginDTO);
      const userDTO = await this.authService.login(loginDTO);
      return res.ok(userDTO);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
