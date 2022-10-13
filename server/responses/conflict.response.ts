import { Request, Response } from "express";

export const conflict =
  (req: Request, res: Response) =>
  (error = {}) => {
    res.status(409);
    res.json(error);
  };
