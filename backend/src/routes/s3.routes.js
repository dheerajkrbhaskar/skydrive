import express from "express";
import { uploadOnBucket, deleteFromBucket, getFileFromBucket, upload, getAllFilesFromBucket } from "../utils/s3.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

//Secure routes, equires valid JWT
router.post("/upload", verifyJWT, upload.single("file"), uploadOnBucket);
router.get("/myfiles", verifyJWT, getAllFilesFromBucket);
router.get("/get", verifyJWT, getFileFromBucket);
router.delete("/delete", verifyJWT,  deleteFromBucket);

export default router;
