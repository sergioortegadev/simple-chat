import express from "express";
import chatController from "../controllers/chatController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

router.get("/assets/beep.mp3", (req, res) => {
  res.sendFile(process.cwd() + "/client/assets/beep.mp3");
});

router.get("/assets/favicon.ico", (req, res) => {
  res.sendFile(process.cwd() + "/client/assets/favicon.ico");
});

export default { router, chatController };
