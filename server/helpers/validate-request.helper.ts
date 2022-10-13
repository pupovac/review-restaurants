import { errors } from "../../config/constants/error.constant";
import { validateOrReject } from "class-validator";

export const validateRequestBody = async (object: Object) => {
  try {
    await validateOrReject(object);
  } catch (error) {
    return Promise.reject(errors.invalidRequest(error));
  }
};
