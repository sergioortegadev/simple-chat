import db from "../config/turso.js";

const sendMessages = async (room, username, datetime, message) => {
  return await db.execute({
    sql: `INSERT INTO messages (chatroom, username, datetime, message) VALUES (:room, :username, :datetime, :message)`,
    args: { room, username, datetime, message },
  });
};

const bringMessages = async (socket) => {
  return await db.execute({
    sql: `SELECT id, username, datetime, message FROM messages WHERE id > ?`,
    args: [socket.handshake.auth.serverOffset ?? 0],
  });
};

export default { sendMessages, bringMessages };
