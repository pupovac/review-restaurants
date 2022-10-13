import { IValidationResult } from "../interfaces/validation/ivalidationresult";
import { injectable } from "inversify";
import { Result, ValidationError, validationResult } from "express-validator";
import { request } from "inversify-express-utils";
import { Request } from "express";

@injectable()
export class ValidationResult implements IValidationResult {
  validate(@request() req: Request): Result<ValidationError> | null {
    return validationResult(req);
  }
}
