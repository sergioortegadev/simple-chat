import express from "express";
import chatController from "../controllers/chatController.js";
const router = express.Router();

const ACCEPTED_ORIGINS = [
  "http://localhost:3000",
  "http://192.168.100.140:3000",
  "http://192.168.100.140:2850",
  "https://sergioortega.com.ar/",
  "https://sergioortega.com.ar/chat/",
];

router.get("/", (req, res) => {
  const origin = req.header("Origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin + "chat/");
    console.log("postman" + origin);
  }

  res.sendFile(process.cwd() + "/frontend/dist/index.html");
});

export default { router, chatController };
