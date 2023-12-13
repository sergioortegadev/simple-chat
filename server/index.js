import "dotenv/config";
import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const port = process.env.PORT ?? 3000;

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,

    skipMiddlewares: true,
  },
});

io.on("connection", async (socket) => {
  socket.on("disconnect", () => {});

  socket.on("chat message", async (user, room) => {
    let username = user.name;
    let datetime = user.msg.date;
    let message = user.msg.text;
    let result;
    try {
      result = await chatRouter.chatController.sendMessages(room, username, datetime, message);
    } catch (error) {
      console.log(` XXX - Error en la DB al enviar los mensajes - ${error}`);
      return;
    }

    io.emit("chat message", user, result.lastInsertRowid.toString());
  });

  if (!socket.recovered) {
    try {
      const dataResults = await chatRouter.chatController.bringMessages(socket);

      dataResults.rows.forEach((row) => {
        let data = {
          name: row.username,
          msg: {
            date: row.datetime,
            text: row.message,
          },
        };
        socket.emit("chat message", data, row.id.toString());
      });
    } catch (error) {
      console.log("XXX - Error en socket o DB al traer mensajes - ", error);
    }
  }
});

app.use(logger("dev"));

import chatRouter from "./src/router/chatRouter.js";
app.use("/", chatRouter.router);

server.listen(port, () => {
  console.log(`▓▒ Server funcionando en puerto ${port} ▒▓`);
});
