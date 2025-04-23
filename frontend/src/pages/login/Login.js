import React, { useState } from "react";
import "./Login.css";

const Login = ({ setUser }) => {
  const [signedIn, setSignedIn] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signedIn) {
      fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }).then((res) => {
        res.json().then((j) => {
          showSnackbar(j.message);
          if (res.status === 200) setUser(j.username);
        });
      });
    } else {
      fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      }).then((res) => {
        res.json().then((j) => {
          showSnackbar(j.message);
          if (res.status === 201) setUser(username);
        });
      });
    }
  };

  const showSnackbar = (message) => {
    var snackbar = document.createElement("div");
    snackbar.className = "snackbar";
    snackbar.textContent = message;

    document.body.appendChild(snackbar);

    setTimeout(() => {
      snackbar.classList.add("show");
    }, 10);

    setTimeout(() => {
      snackbar.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(snackbar);
      }, 500);
    }, 3000);
  };

  return (
    <div className="App">
      <div className="formContainer">
        <h1 className="cormorant-garamond-bold">
          {signedIn ? "Login" : "Register"}
        </h1>
        <form onSubmit={handleSubmit}>
          {!signedIn && (
            <div className="formGroup">
              <input
                autoComplete="username webauthn"
                type="username"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
          )}
          <div className="formGroup">
            <input
              autoComplete="email webauthn"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={signedIn ? "Username or Email" : "Email"}
            />
          </div>
          <div className="formGroup">
            <input
              autoComplete="current-passsword"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button className="fill-available" type="submit">
            {signedIn ? "Login" : "Register"}
          </button>
          <div className="a" onClick={() => setSignedIn(!signedIn)}>
            {signedIn ? "Don't " : "Already "}have an account?&nbsp;
            <u>{signedIn ? "Register" : "Login"}</u>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
