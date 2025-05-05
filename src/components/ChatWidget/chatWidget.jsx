import { useEffect, useState, useRef } from "react";
import { getChatHistory, sendMessage } from "../../services/chat";
import { io } from "socket.io-client";
import "./chatWidget.css";

const authUrl = import.meta.env.VITE_BE_URL || "http://localhost:8080";
const socket = io(authUrl);

const ChatWidget = ({ userId, isAdmin = false }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchChat();
      socket.emit("join", userId);
      socket.on("newMessage", (newMsg) => {
        setChat((prev) => [...prev, newMsg]);
      });
    }

    return () => {
      socket.off("newMessage");
    };
  }, [userId]);

  const fetchChat = async () => {
    try {
      const res = await getChatHistory(userId);
      setChat(res);
    } catch (err) {
      console.error("Cannot get chat history:", err);
    }
  };

  const ADMIN_ID = "6811c3de413dab1c1a26e3ed";

  const handleSend = async () => {
    if (!message.trim()) return;

    const receiverId = isAdmin ? chat[0]?.senderId || userId : ADMIN_ID;
    const newMsg = {
      senderId: userId,
      receiverId,
      content: message,
      isAdmin,
    };

    try {
      const res = await sendMessage(newMsg);
      setChat((prev) => [...prev, res]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="chat-widget">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="chat-toggle-button"
      >
        {open ? "Close" : "💬 Chat with Admin"}
      </button>

      {open && (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <span>Online support</span>
            <button
              onClick={() => setOpen(false)}
              className="chat-close-button"
            >
              ✕
            </button>
          </div>

          {/* Chat content */}
          <div className="chat-content">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message-wrapper ${
                  msg.senderId === userId ? "sent" : "received"
                }`}
              >
                <div className="chat-message">{msg.content}</div>
              </div>
            ))}
            <div ref={chatRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Enter a message..."
            />
            <button onClick={handleSend} className="chat-send-button">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
