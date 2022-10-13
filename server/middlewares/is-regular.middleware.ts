import { BaseMiddleware } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ROLES } from "../../config/constants/enum.contants";

export class IsRegularMiddleware extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction): void {
    {
      const token = req.headers["x-access-token"];
      if (!token) return res.unauthorized({ message: "No token provided." });

      const decoded = jwt.decode(String(token));
      if ((decoded as any).role === ROLES.regular) {
        next();
      } else return res.unauthorized({ message: "Not valid role." });
    }
  }
}
