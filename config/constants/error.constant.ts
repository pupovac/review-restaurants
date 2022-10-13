import { ResponseError } from "../../server/models/dto/response-error.dto";

export const errors = {
  genericServerError: (error: any) => {
    let responseError = new ResponseError(error.name, error.message, 500, error.stack);
    return responseError;
  },

  resourceNotFound: (resource: string) => {
    let responseError = new ResponseError("Not found", `${resource} not found.`, 404, undefined);
    return responseError;
  },

  operationFailed: (operation: string, message: string) => {
    let responseError = new ResponseError(`${operation} failed.`, message, 500, undefined);
    return responseError;
  },

  resourceAlreadyExist: (resource: string) => {
    let responseError = new ResponseError("Failed", `${resource} already exist.`, 400, undefined);
    return responseError;
  },

  unauthorized: (message: string) => {
    let responseError = new ResponseError("Unauthorized", message, 401, undefined);
    return responseError;
  },

  invalidRequest: (error: any) => {
    const validationErrors = error.map((e: any) => {
      const propety = e.property;
      const message = e.constraints[Object.keys(e.constraints)[0]];
      return { propety, message };
    });

    let responseError = new ResponseError("Invalid request.", "", 400, undefined, validationErrors);
    return responseError;
  },
};
