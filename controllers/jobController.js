import { StatusCodes } from "http-status-codes";
import checkPermission from "../utils/checkPermission.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import Job from "../models/Job.js";
import mongoose from "mongoose";
import moment from "moment";

const getAllJob = async (req, res) => {
  const { status, search, jobType, sort } = req.query;
  const queryObject = {
    createBy: req.user.userId,
  };
  //add stuff based on condition
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search && search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  //NO AWAIT
  let result = Job.find(queryObject);
  //chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  //pagination xong mới await result
  const allJobs = await result;
  //tinh' totalJobs and numOfpage
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(200).json({ allJobs, totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
  const { company, position } = req.body;
  const { id: jobId } = req.params;
  if (!company || !position) {
    throw new BadRequestError("Please Provide All Values");
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  //check permissions
  checkPermission(req.user, job.createBy);
  //done check permission
  const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updateJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  //check permissions
  checkPermission(req.user, job.createBy);
  //done check permission
  const deletedJob = await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Job deleted!" });
};

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createBy = req.user.userId;
  const job = await Job.create(req.body);
  await job.save();
  res.status(StatusCodes.CREATED).json({ job });
};

const showStats = async (req, res) => {
  // console.log("req", req); //this line was used to check where the hell is userId from in request
  let stats = await Job.aggregate([
    { $match: { createBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  // monthlyApplications = monthlyApplications.reduce((acc, curr) => {
  //   const { _id, count } = curr;
  //   const dateText = _id.year.toString() + " " + _id.month.toString();
  //   acc[dateText] = count;
  //   return acc;
  // }, {});
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      //accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse(); // cái này để data từ cũ tới mới => hiển thị ra chart
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { getAllJob, deleteJob, updateJob, createJob, showStats };
