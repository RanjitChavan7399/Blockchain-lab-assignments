import express from "express";
import multer from "multer";
import FormData from "form-data";
import cors from "cors";
import fetch from "node-fetch"; // ✅ IMPORTANT

import fs from "fs";
import path from "path";
import os from "os";

const app = express();
app.use(cors());

const upload = multer();

// 🔐 PUT YOUR NEW PINATA JWT HERE
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwNGY4ODQ3Yi01OWE0LTQ5ODUtODA3MS1lOTBjYTM4MmNhZDIiLCJlbWFpbCI6InJhbmppdGNoYXZhbjExMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZTJkODQ3MDZjZmNkMDIyOGUxMzAiLCJzY29wZWRLZXlTZWNyZXQiOiJlNjYwYjJmM2E2YzI4NmNmNGY4ZGI4Y2IwMWViMGI2MTg2NWY5YWM1NDA1NjExY2Q2MTExZjQ5YzA2MjM0YmNiIiwiZXhwIjoxODA4MzI1MTI0fQ.45_H0fRhU96KLwfSoxiX8oi7wLD2jmmrtFjnIG_6eG4";

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📁 File received:", req.file.originalname);

    // ✅ Save file temporarily
    const tempPath = path.join(os.tmpdir(), req.file.originalname);
    fs.writeFileSync(tempPath, req.file.buffer);

    // ✅ Prepare form data
    const data = new FormData();
    data.append("file", fs.createReadStream(tempPath));

    // ✅ Send to Pinata
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          ...data.getHeaders(), // 🔥 VERY IMPORTANT
        },
        body: data,
      }
    );

    const result = await response.json();
    console.log("📦 Pinata Response:", result);

    // ❌ If error from Pinata
    if (!result.IpfsHash) {
      return res.status(400).json(result);
    }

    // ✅ Send success response
    res.json(result);

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Upload failed");
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});