import {Request} from "express";
import {Result, ValidationError} from "express-validator";

export interface IValidationResult {
    validate(req: Request): Result<ValidationError> | null;
}