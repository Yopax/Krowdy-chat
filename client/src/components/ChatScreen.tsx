import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MSG } from "../graphql/queries";
import { SEND_MSG } from "../graphql/mutations";
import MessageCard from "./MessageCard";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MessageProps from "../interface/MessageProps";
import { MSG_SUB } from "../graphql/subscriptions";

const ChatScreen = () => {
  const { id, name } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const bottomRef = useRef(null);

  const { data, loading, error } = useQuery(GET_MSG, {
    variables: {
      receiverId: +id,
    },
    onCompleted(data) {
      setMessages(data.messagesByUser);
    },
    pollInterval: 2000, 
  });

  const [sendMessage] = useMutation(SEND_MSG, {
    onCompleted: (data) => {
      setMessages((prevMessages) => [...prevMessages, data.createMessage]);
    },
  });

  useSubscription(MSG_SUB, {
    onSubscriptionData({ subscriptionData: { data } }) {
      setMessages((prevMessages) => [...prevMessages, data.createMessage]);
    },
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage({ variables: { receiverId: parseInt(id), text } });
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Cabecera */}
      <div className="flex items-center p-4 text-black bg-white h-14">
        <img
          className="w-8 h-8 rounded-full"
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
          alt="Avatar"
        />
        <h2 className="ml-3 font-semibold text-gray-800 letra inter">{name}</h2>
      </div>

      {/* Lista de mensajes */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar-orange bg-cover bg-[url('/portada.webp')]">
        {loading ? (
          <p>Cargando mensajes...</p>
        ) : error ? (
          <p>Error al cargar mensajes</p>
        ) : (
          messages.map((msg) => (
            <MessageCard
              key={msg.id}
              text={msg.text}
              date={msg.createdAt}
              direc={msg.senderId === parseInt(id) ? "start" : "end"}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Caja de texto */}
      <div className="flex items-center p-4 bg-gray-200">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="p-2 ml-3 text-white bg-blue-500 rounded-full hover:bg-blue-600"
        >
          <IoMdSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;