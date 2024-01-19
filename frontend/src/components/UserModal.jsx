import { useState, useEffect } from "react";

const UserModal = ({ reciveUser }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userName")) {
      setInput(localStorage.getItem("userName"));
    }
  }, []);

  const sendUser = (e) => {
    e.preventDefault();
    if (input === "") return;

    reciveUser(input);
    localStorage.setItem("userName", input);
  };

  return (
    <>
      <div id="user-modal">
        <section className="user-modal-back">
          <div className="user-modal">
            <h2>Ingresar Usuario</h2>
            <form>
              <input
                autoFocus
                type="text"
                name="user"
                placeholder="escribe tu nombre"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />
              <button onClick={sendUser}>ingresar</button>
            </form>
          </div>
        </section>
        <section id="developer">
          <h6>
            <a href="https://github.com/sergioortegadev/simple-chat" rel="noopener noreferrer" target="_blank">
              GitHub repo
            </a>
          </h6>
          <h6>
            <a href="https://sergioortega.com.ar/#/portfolio" rel="noopener noreferrer" target="_blank">
              Return to Portfolio
            </a>
          </h6>
          <h5>
            <a href="https://sergioortega.com.ar" rel="noopener noreferrer" target="_blank">
              SimpleChat developed by Sergio Ortega
            </a>
          </h5>
        </section>
      </div>
    </>
  );
};

export default UserModal;
