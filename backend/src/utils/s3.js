import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { use } from "react";
dotenv.config({ path: "src/.env" });

const upload = multer();
const bucket = process.env.BUCKET_NAME;

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// Upload to S3
export const uploadOnBucket = async (req, res) => {
  try {
    const userId = req.user?._id;
    const file = req.file;
    console.log("Recieved file from from frontend request", file)
    if (!file) return res.status(400).json({ error: "No file provided" });

    const fileSize = file.size; //in bytes

    console.log("size of recieved file", fileSize)
    const user = await User.findById(userId)
    console.log(`User: ${user}`)
    //step 1: check available storage
    const total = user.maxStorage;
    const used = user.usedStorage;
    //console.log(` current: ${used}/${total}`)
    const availableStorage = total - used;

    //console.log(`Available Storage ${availableStorage} for ${user.fullname}`)
    if (availableStorage < fileSize) {
      console.log("Insufficient storage space")
      return res.status(400).json({ error: "Insufficient storage space" })
    }

    //step2: reserve storage
    user.usedStorage += fileSize
    await user.save()

    console.log(`After reserving  Storage ${user.usedStorage} for ${user.fullname}`)

    //step3: attempt upload
    try {
      const fileKey = `uploads/${userId}/${Date.now()}-${file.originalname}`;

      const uploadResult = await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      console.log("Uploaded", file.originalname)

      res.status(201).json({ message: "File upload successful", fileKey: uploadResult.Key });

    } catch (uploadError) {
      user.usedStorage -= fileSize
      await user.save()
      throw new uploadError
    }


  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
};

//get from S3(preview)
export const getFileFromBucket = async (req, res) => {
  try {
    const { fileKey } = req.query;
    if (!fileKey)
      return res.status(400).json({ error: "fileKey is required in query" });

    const signedUrl = await getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: bucket, Key: fileKey }),
      { expiresIn: 3600 }
    );

    console.log("Signed URL generated for:", fileKey);
    res.status(200).json({ fileKey, signedUrl });
  } catch (error) {
    console.error("Get File Error:", error);
    res.status(500).json({ error: "Failed to get file", details: error.message });
  }
};

// Delete from S3
export const deleteFromBucket = async (req, res) => {
  try {
    const userId = req.user._id
    const fileKey = req.query.fileKey
    const fileSize = Number(req.query.fileSize)

    if (!fileKey)
      return res.status(400).json({ error: "fileKey is required" });
    if (isNaN(fileSize))
      return res.status(400).json({ error: "fileSize must be a valid number" });


    await client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: fileKey })
    );

    const user = await User.findById(userId)
    user.usedStorage = Math.max(0, user.usedStorage - fileSize)
    await user.save()

    console.log(" Deleted:", fileKey);
    res.status(200).json({ message: "File deleted successfully", fileKey });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
};


// Get all files for a user
export const getAllFilesFromBucket = async (req, res) => {
  try {
    const userId = req.user?._id || "anonymous";
    const prefix = `uploads/${userId}/`;

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const response = await client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return res.status(200).json({ message: "No files found", files: [] });
    }

    // Prepare list with signed URLs and clean names
    const files = await Promise.all(
      response.Contents.map(async (item) => {
        const fileKey = item.Key;
        const signedUrl = await getSignedUrl(
          client,
          new GetObjectCommand({ Bucket: bucket, Key: fileKey }),
          { expiresIn: 3600 } // 1 hour
        );

        // Extract original filename
        // Example: uploads/12345/1730897632-myphoto.png → myphoto.png
        const cleanedName = fileKey.split("/").pop().replace(/^\d+-/, "");

        return {
          fileKey,
          fileName: cleanedName,
          size: item.Size,
          lastModified: item.LastModified,
          url: signedUrl,
        };
      })
    );

    res.status(200).json({
      message: "Files retrieved successfully",
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("List Files Error:", error);
    res.status(500).json({
      error: "Failed to list files",
      details: error.message,
    });
  }
};



export { upload };
