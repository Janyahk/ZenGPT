import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import { useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
function App() {
  // ---------------- User Auth ----------------
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(!user);
  const [showRegister, setShowRegister] = useState(false);

  const [promt, setpromt] = useState("");
  const [reply, setreply] = useState(null);
  const [currentThreadId, setcurrentThreadId] = useState(uuidv1());
  const [prevChats, setprevChats] = useState([]);
  const [newChat, setnewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const providerValue = {
    promt,
    setpromt,
    reply,
    setreply,
    currentThreadId,
    setcurrentThreadId,
    newChat,
    setnewChat,
    prevChats,
    setprevChats,
    allThreads,
    setAllThreads,
    theme,
    toggleTheme,
    setUser,
    setShowLogin,
    setShowRegister,
    user,
  };

  const handleLogin = (u) => {
    setUser(u);
    setShowLogin(false);
    setShowRegister(false);
  };

  useEffect(() => {
    // Whenever user logs in OR logs out
    setprevChats([]);
    setreply(null);
    setnewChat(true);
    setcurrentThreadId(uuidv1());
  }, [user]);

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <div className={`app ${theme}`}>
        <MyContext.Provider value={providerValue}>
          <Sidebar></Sidebar>
          {user && <ChatWindow></ChatWindow>}
        </MyContext.Provider>
        {/* Logout button */}

        {!user && (
          <div className="auth">
            <div className="authModal">
              {showLogin && <Login onLogin={handleLogin} />}
              {showRegister && <Register onLogin={handleLogin} />}
              <div className="authSwitch">
                {showLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <span onClick={switchToRegister}>Register</span>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <span onClick={switchToLogin}>Login</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
