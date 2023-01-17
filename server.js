import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import morgan from "morgan";
//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
//routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import auth from "./middleware/auth.js";
//build front-end application for deploy
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
//sercurity packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.json()); //make the JSON dât available to use in the controllers

//use Cookie middleware
app.use(cookieParser());
//prepare for deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));
//sercurity packages
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//route
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.get("/", (req, res) => {
  //   throw new Error("");
  res.send("welcome!");
});
app.get("/api/v1", (req, res) => {
  //   throw new Error("");
  res.send({ msg: "API Proxy" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth, jobRouter);
//prepare for deployment
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); //để ở dưới cùng, trên cái listen thôi

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server in listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
