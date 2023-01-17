import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./Custom-api.js";

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
export default UnauthenticatedError;
