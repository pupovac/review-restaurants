import { NextFunction, Request, Response } from "express";

export interface IIsRegularMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void;
}
