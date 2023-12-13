import "dotenv/config";
import { createClient } from "@libsql/client";

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

export default db;
