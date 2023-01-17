import { StatusCodes } from "http-status-codes";
const errorHandlerMiddleware = (error, req, res, next) => {
  // console.log(error); bỏ cái này khi deploy
  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: error.message || "something went wrong, try again later",
  };
  //missing feild
  if (error.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(error.errors)
      .map((err) => {
        return err.message;
      })
      .join(",");
  }
  //unique field
  if (error.code && error.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    const uniqueField = Object.keys(error.keyValue);
    defaultError.msg = `${uniqueField} field: ${error.keyValue[uniqueField]} has already used!`;
  }
  res
    .status(defaultError.statusCode)
    .json({ msg: defaultError.msg, err: error });
};

export default errorHandlerMiddleware;
