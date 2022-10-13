import { NextFunction, Request, Response } from "express";

export interface IVerifyTokenMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void;
}
