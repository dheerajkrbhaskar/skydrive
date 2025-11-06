//WITH MULTER
// import express from 'express'
// import dotenv from 'dotenv';
// import cors from 'cors'
// import multer from 'multer'
// import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
// dotenv.config({ path: './src/.env' })
// const app = express()
// const upload = multer()
// const bucket = process.env.BUCKET_NAME

// const client = new S3Client({

//     region: "ap-south-2",
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,

//     }
// });

// app.use(
//     cors(
//         {
//             origin: process.env.CORS_ORIGIN,
//             credentials: true
//         }
//     )
// )
// app.get('/', (req, res) => {
//     res.send(`<h2>File Upload to AWS S3 using <code>"Node.js"</code></h2>
//     <form action="/api/upload" enctype="multipart/form-data" method="post">
//       <div>Select a file: 
//         <input type="file" name="file" multiple="multiple" />
//       </div>
//       <input type="submit" value="Upload" />
//     </form>`)
// })

// app.post("/api/upload", upload.single('file'), async (req, res) => {
//     try {
//         const file = req.file
//         if (!file) return res.status(400).json({ error: "No file uploaded" })

//         const fileKey = `uploads/${Date.now()}-${file.originalname}`
//         const command = new PutObjectCommand({
//             Bucket: bucket,
//             Key: fileKey,
//             Body: file.buffer,
//             ContentType: file.mimetype
//         })

//         await client.send(command)
//         const url = await getSignedUrl(client, command)
//         console.log('File uploaded successfully: ', fileKey)
//         res.json({ message: "Upload successful", url })

//     } catch (error) {
//         console.error("Upload Error", error)
//         res.status(500).json({ error: "Upload failed", details: error.message })
//     }
// })

// export { app }





//without multer get presign url then upload on that url by put request


// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// dotenv.config({ path: './src/.env' })

// const app = express();
// const bucket = process.env.BUCKET_NAME;

// // AWS S3 client configuration
// const client = new S3Client({
//   region: 'ap-south-2',
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   },
// });

// // Enable CORS
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

// // ✅ Root route (optional)
// app.get('/', (req, res) => {
//   res.send(`<h2>Presigned Upload Demo</h2>
//     <p>Use /api/presign-url?fileName=myfile.png&contentType=image/png to get a presigned URL.</p>
//   `);
// });

// // ✅ Generate presigned upload URL
// app.get('/api/presign-url', async (req, res) => {
//   try {
//     const { fileName, contentType } = req.query;

//     if (!fileName || !contentType)
//       return res.status(400).json({ error: 'fileName and contentType are required' });

//     // Generate unique key for S3 object
//     const fileKey = `${fileName}`;

//     // Create command to upload
//     const command = new PutObjectCommand({
//       Bucket: bucket,
//       Key: fileKey,
//       ContentType: contentType,
//     });



//     res.json({
//       uploadUrl: signedUrl,
//       fileUrl: `https://${bucket}.s3.ap-south-2.amazonaws.com/${fileKey}`,
//     });
//   } catch (error) {
//     console.error('Error generating presigned URL:', error);
//     res.status(500).json({ error: 'Failed to generate presigned URL', details: error.message });
//   }
// });

// async function init() {
//     // Generate presigned URL (valid for 1 hour)
//     const command = new PutObjectCommand({
//       Bucket: bucket,
//       Key: '1',
//       ContentType: 'image/png',
//     });
//     const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

//     console.log(signedUrl)

// }
// init()

// export { app };

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import multer from "multer"

const app = express();

app.use(
  cors(
    {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  )
)
//common middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

import userRouter from "./routes/user.router.js"
import s3Routes from "./routes/s3.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/s3", s3Routes);

app.get("/about", (req, res) => {
  res.send("Hello, welcome to skydrive")
})

export { app }








