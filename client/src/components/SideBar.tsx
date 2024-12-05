import { GET_ALL_USERS } from "../graphql/queries";
import UserCard from "./UserCard";
import { MdOutlineExitToApp } from "react-icons/md";
import { useQuery } from "@apollo/client";

function SideBar({ setloggedIn }) {

  const { loading, data, error} = useQuery(GET_ALL_USERS)

  if (loading) return <p>Loading Chats...</p>
  if(data){
    console.log(data)
  }
  if(error){
    console.log(error.message)
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setloggedIn(false);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
          <h2 className="text-xl font-bold inter">Chat</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-red-500 rounded inter hover:bg-gray-200"
          >
            <MdOutlineExitToApp className="text-2xl" />
            <span>Salir</span>
          </button>
        </div>
        <div className="p-4 ">
          {data.users.map((item) => (
            <UserCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBar;
