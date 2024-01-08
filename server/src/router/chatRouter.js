import express from "express";
import chatController from "../controllers/chatController.js";
const router = express.Router();

const ACCEPTED_ORIGINS = [
  "http://192.168.100.140:3000",
  "http://192.168.100.140:2850",
  "https://sergioortega.com.ar/",
  "https://sergioortega.com.ar/chat/",
];

router.get("/", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.sendFile(process.cwd() + "/client/index.html");
});

router.get("/assets/beep.mp3", (req, res) => {
  res.sendFile(process.cwd() + "/client/assets/beep.mp3");
});

router.get("/assets/favicon.ico", (req, res) => {
  res.sendFile(process.cwd() + "/client/assets/favicon.ico");
});

export default { router, chatController };
