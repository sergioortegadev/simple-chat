import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import "dotenv/config";
import { createClient } from "@libsql/client";

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,

    skipMiddlewares: true,
  },
});

const db = createClient({
  url: "libsql://simple-chat-db-sergioortegadev.turso.io",
  authToken: process.env.DB_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatroom TEXT,
    username TEXT,
    datetime TEXT,
    message TEXT
  )
`);

io.on("connection", async (socket) => {
  // console.log(` + User conectado +`);

  socket.on("disconnect", () => {
    // console.log(` - Usuario desconectado -`);
  });

  socket.on("chat message", async (user, room) => {
    let username = user.name;
    let datetime = user.msg.date;
    let message = user.msg.text;
    let result;
    try {
      result = await db.execute({
        sql: `INSERT INTO messages (chatroom, username, datetime, message) VALUES (:room, :username, :datetime, :message)`,
        args: { room, username, datetime, message },
      });
    } catch (error) {
      console.log(` XXX - Error en la DB al traer los mensajes anteriores: ${error}`);
      return;
    }

    //console.log(`  - User: ${user.name} emitió mensaje`);
    io.emit("chat message", user, result.lastInsertRowid.toString());
  });

  if (!socket.recovered) {
    /* let dataResults = {} */
    try {
      /* dataResults.name = await db.execute({
       sql: `SELECT id, username FROM messages WHERE id > ?`,
       args: [socket.handshake.auth.serverOffset ?? 0],
     });
     dataResults.msg.date = await db.execute({
       sql: `SELECT id, datetime FROM messages WHERE id > ?`,
       args: [socket.handshake.auth.serverOffset ?? 0],
     }); */
      const dataResults = await db.execute({
        sql: `SELECT id, username, datetime, message FROM messages WHERE id > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0],
      });

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
    } catch (error) {}
  }
});

app.use(logger("dev"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

app.get("/assets/beep.mp3", (req, res) => {
  res.sendFile(process.cwd() + "/client/assets/beep.mp3");
});

server.listen(port, () => {
  console.log(`▓▒ Server funcionando en puerto ${port} ▒▓`);
});
