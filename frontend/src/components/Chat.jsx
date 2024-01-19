import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import ChatElement from "./ChatElement.jsx";

const Chat = ({ userName, setShowChat }) => {
  let userInit = {
    name: userName,
    msg: {
      to: "",
      text: "",
      date: "",
    },
  };

  const user = useRef(userInit);

  const [inputMessage, setInputMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [send, setSend] = useState(false);

  const [serverOffset, setServerOffset] = useState(0);

  const socket = io("/");

  const beep = new Audio("./assets/beep.mp3");
  beep.volume = 0.5;

  const refMessagesEnd = useRef(null);

  useEffect(() => {
    socket.on("chat message", (data, socketServerOffset) => {
      receiveMessage(data);
      setServerOffset(socketServerOffset);

      return () => {
        socket.off("chat message", receiveMessage(data));
      };
    });
  }, []);

  useEffect(() => {
    if (refMessagesEnd.current) {
      refMessagesEnd.current.scrollTop = refMessagesEnd.current.scrollHeight;
    }
  }, [messages]);

  let room = "canal1"; // prompt(`Ingrese canal de chat`);

  const sendMessage = (e) => {
    e.preventDefault();

    if (inputMessage === "") return;

    user.current.msg.date = new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit" });
    user.current.msg.text = inputMessage;

    setSend(true);

    setInputMessage("");
  };

  useEffect(() => {
    if (send === false) return;

    socket.emit("chat message", user.current, room);

    setSend(false);
  }, [send]);

  const handleInputMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const receiveMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);

    if (data.name != user.current.name) {
      beep.play();
    }
  };

  return (
    <>
      <div id="chat">
        <section id="chat-header">
          <button className="chat-button-back" onClick={() => setShowChat(false)}>
            <i className="bi bi-arrow-left"></i>
          </button>
        </section>
        <section id="chat-main" ref={refMessagesEnd}>
          <div id="messages">
            {messages.map((data, index) => (
              <ChatElement data={data} user={user} key={index} />
            ))}
          </div>
          <form id="form">
            <input
              autoFocus
              id="input"
              type="text"
              value={inputMessage}
              onChange={handleInputMessageChange}
              name="message"
              placeholder="Escribe un mensaje"
              autoComplete="off"
            />
            <button onClick={sendMessage} className="chat-button">
              <i className="bi bi-arrow-right"></i>
            </button>
            {/* <button onClick={sendMessage} className="chat-button">
              ▶
            </button> */}
          </form>
        </section>
      </div>
    </>
  );
};

export default Chat;
