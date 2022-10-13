import { NextFunction, Request, Response } from "express";

export interface IIsOwnerMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void;
}
