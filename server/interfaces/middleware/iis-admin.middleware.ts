import { NextFunction, Request, Response } from "express";

export interface IIsAdminMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void;
}
