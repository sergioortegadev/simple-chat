const ChatElement = ({ data, user }) => {
  return (
    <>
      {data.name == user.current.name ? (
        <div className="chat me">
          <p>{data.msg.text}</p>
          <p className="chat-date">{data.msg.date}</p>
        </div>
      ) : (
        <div className="chat others">
          <p>
            <strong>{data.name}</strong>
            <br />
            {data.msg.text}
          </p>
          <p className="chat-date">{data.msg.date}</p>
        </div>
      )}
    </>
  );
};

export default ChatElement;
