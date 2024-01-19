import "./App.css";
import { useState } from "react";
import Chat from "./components/Chat";
import UserModal from "./components/userModal";

function App() {
  const [userName, setUserName] = useState(false);

  const [showChat, setShowChat] = useState(false);

  const reciveUser = (nombre) => {
    setUserName(nombre);
    setShowChat(true);
  };

  return (
    <>{showChat ? <Chat userName={userName} setShowChat={setShowChat} /> : <UserModal reciveUser={reciveUser} />}</>
  );
}

export default App;
