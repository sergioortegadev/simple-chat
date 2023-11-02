import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import "dotenv/config";

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(` + User conectado +`);

  socket.on("disconnect", () => {
    console.log(` - Usuario desconectado -`);
  });

  socket.on("chat message", (msg) => {
    console.log(`  - User: ${msg.name} emitió mensaje`);
    io.emit("chat message", msg);
  });
});

app.use(logger("dev"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(port, () => {
  console.log(`▓▒ Server funcionando en puerto ${port} ▒▓`);
});
