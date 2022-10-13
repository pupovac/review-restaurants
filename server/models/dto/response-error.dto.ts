export class ResponseError implements Error {
  public name: string;
  public message: string;
  public code: number | undefined;
  public stack: string | undefined;
  public validationErrors: Object | undefined;
  constructor(name: string, message: string, code?: number, stack?: string, validationErrors?: Object) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.stack = stack;
    this.validationErrors = validationErrors;
  }
}
