import express from "express";
import {
  createJob,
  deleteJob,
  getAllJob,
  showStats,
  updateJob,
} from "../controllers/jobController.js";
const router = express.Router();

router.route("/:id").delete(deleteJob).patch(updateJob);
router.route("/").get(getAllJob);
router.post("/", createJob); //hoặc router.route('/').post(createJob)
router.route("/:id").get(showStats);

export default router;
