import AuthScreen from "./pages/AuthScreen";
import HomeScreen from "./pages/HomeScreen";
import { useState } from "react";

function App() {
  const [loggedIn, setloggedIn] = useState(
    localStorage.getItem("jwt") ? true : false
  );

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setloggedIn(false);
  };

  return (
    <>
      {loggedIn ? (
        <HomeScreen setloggedIn={setloggedIn} onLogout={handleLogout} />
      ) : (
        <AuthScreen />
      )}
    </>
  );
}

export default App;

