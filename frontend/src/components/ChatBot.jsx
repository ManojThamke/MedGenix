import { useState } from "react";
import { chat } from "../services/api";

function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await chat(input);

      const botMessage = {
        sender: "bot",
        text: res.data.reply || "No response"
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error connecting to AI" }
      ]);
    }

    setInput("");
  };

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-3">🤖 AI Assistant</h2>

      {/* Chat messages */}
      <div className="h-48 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-500 text-right"
                : "bg-gray-700 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
          placeholder="Ask about Parkinson's..."
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 px-4 rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;