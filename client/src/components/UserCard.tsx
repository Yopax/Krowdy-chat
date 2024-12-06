import { useNavigate } from "react-router-dom";
import UserCardProps from "../interface/UserCardPros";

function UserCard({ item: { firstName, lastName, id } }: UserCardProps) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex items-center px-3 py-2 space-x-2 rounded-lg hover:bg-slate-200"
        onClick={() => navigate(`/${id}/${firstName}${lastName}`)}
      >
        <img
          className="w-8 h-8 my-1 rounded-full"
          src={` https://api.dicebear.com/9.x/initials/svg?seed=${firstName}${lastName}`}
        />
        <h2 className="text-gray-800 inter">
          {firstName} {lastName}
        </h2>
      </div>
    </>
  );
}

export default UserCard;
