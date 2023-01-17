import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
    select: false,
    // maxlength: 20,
  },
  lastName: {
    type: String,
    // required: [true, "please provide last name"],
    default: "LastName",
    maxlength: 20,
    trim: true,
  },
  location: {
    type: String,
    maxlength: 20,
    // required: [true, "please provide location"],
    trim: true,
    default: "my city",
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!this.isModified("password")) return;
  // const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, 8);
  // next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
    // expiresIn: "5000",
  });
};

const User = mongoose.model("User", UserSchema);
export default User;
