import MessageCardProps from "../interface/MessageCardProps";

const MessageCard: React.FC<MessageCardProps> = ({ text, direc, date,  }) => {
  return (
    <div
      className={`flex w-full mb-2 ${
        direc === "end" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs inter px-3 py-1 rounded-lg ${
          direc === "end" ? "bg-[#ffc000] text-black" : "bg-white text-black "
        }`}
      >
        <p className="text-sm">{text}</p>
        <p className=" justify-end flex text-[10px] text-gray-800">
          {new Date(date).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
