import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {newReport,getReports} from "../controllers/reportController.js"
const router = express.Router();

// @desc NEW REPORT 
router.post("/new",upload.single("picture"),newReport);

// @desc get user reports
router.get("/",getReports);
export default router;