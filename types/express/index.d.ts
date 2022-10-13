import * as express from "express";

declare global {
  namespace Express {
    export interface Response {
      ok?: any;
      created?: any;
      noContent?: any;
      badRequest?: any;
      conflict?: any;
      notFound?: any;
      unauthorized?: any;
      forbidden?: any;
      serverError?: any;
    }
  }
}
