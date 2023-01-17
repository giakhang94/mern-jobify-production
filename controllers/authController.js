import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
//import Error handler
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
// import { urlencoded } from "express";
import attachCookies from "../utils/attachCookies.js";

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  attachCookies({ res, token });
  await user.save();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastName: user.lastName,
    },
    location: user.location,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all emall and password");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const isMatchPassword = await user.comparePassword(password);
  if (isMatchPassword === false) {
    throw new UnauthenticatedError("password not match");
  }
  const token = user.createJWT();
  user.password = undefined;
  //cookie
  attachCookies({ res, token });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  await user.save();
  const token = user.createJWT();
  attachCookies({ res, token });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};
//use cookie
//get current user => sử dụng thay cho local storage để luuw user đang login
const getCurentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  //userId get by decode token (from schema createJWT)
  res.status(StatusCodes.OK).json({ user, location: user.location });
};
//logout (cookie) - replace cookie by a string (exp: 'logout')
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
export { register, login, updateUser, getCurentUser, logout };
