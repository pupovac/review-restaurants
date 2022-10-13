import { Request, Response } from "express";

export const unauthorized =
  (req: Request, res: Response) =>
  (error = {}) => {
    res.status(401);
    res.json(error);
  };
