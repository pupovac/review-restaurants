import { BaseMiddleware } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH } from "../../config/constants/auth.constant";
import { mongoose } from "@typegoose/typegoose";

export class VerifyTokenMiddleware extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction): void {
    {
      const token = req.headers["x-access-token"];
      if (!token) return res.unauthorized({ message: "No token provided." });

      jwt.verify(String(token), AUTH.secret, (error, decoded) => {
        if (error) return res.unauthorized({ message: "Unauthorized." });

        req.headers.userId = decoded!.id;
        req.headers.user = `${decoded!.firstName} ${decoded!.lastName}`;
        req.headers.role = decoded!.role;

        if (req.method === "POST") {
          req.body.createdBy = new mongoose.Types.ObjectId(decoded!.id);
          req.body.updatedBy = new mongoose.Types.ObjectId(decoded!.id);
        } else if (req.method === "PUT") req.body.updatedBy = new mongoose.Types.ObjectId(decoded!.id);

        next();
      });
    }
  }
}
