import express from "express";
import {
  getCurentUser,
  login,
  logout,
  register,
  updateUser,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

import rateLimiter from "express-rate-limit";
//gioi han so luong request trong 15phut
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
const router = express.Router();

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.patch("/updateUser", auth, updateUser); //router.route('/updateUser').patch(updateUser)
router.get("/getCurrentUser", auth, getCurentUser);
router.get("/logout", logout); //GET chu k phai POST

export default router;
