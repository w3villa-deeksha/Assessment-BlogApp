import React, { useState } from "react";
import "./App.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import AdminPage from "./pages/admin/Admin";

const App = () => {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const setUser = (newUsername) => {
    fetch("http://localhost:5000/is_admin", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: newUsername,
      }),
    }).then((res) => setIsAdmin(res.status == 200));

    setUsername(newUsername);
  };

  return username != "" ? (
    isAdmin ? (
      <AdminPage setUsername={setUsername} />
    ) : (
      <Home setUsername={setUsername} username={username} />
    )
  ) : (
    <Login setUser={setUser} />
  );
};

export default App;
