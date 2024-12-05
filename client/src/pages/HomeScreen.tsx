import { Route, Routes } from "react-router-dom";
import SideBar from "../components/SideBar";
import Welcome from "../components/Welcome";
import ChatScreen from "../components/ChatScreen";

export function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/:id/:name" element={<ChatScreen />} />
    </Routes>
  );
}

function HomeScreen({ setloggedIn }) {
  return (
    <>
      <div className="flex w-screen h-screen ">
        <div className="w-[25%] ">
          <SideBar setloggedIn={setloggedIn} />
        </div>
        <div className="w-[85%] bg-[#3f3f3f]">
          <AllRoutes />
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
