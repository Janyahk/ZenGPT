import { useContext, useState, useEffect } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
function ChatWindow() {
  const {
    promt,
    setpromt,
    reply,
    setreply,
    currentThreadId,
    setcurrentThreadId,
    prevChats,
    setprevChats,
    setnewChat,
    theme,
    toggleTheme,
    setUser,
    setShowLogin,
    setShowRegister,
    user,
  } = useContext(MyContext);
  const [loading, setloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (promt && reply) {
      setprevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: promt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setpromt("");
  }, [reply]);

  const getReply = async () => {
    const token = localStorage.getItem("token"); // get JWT
    if (!token) {
      alert("You must login first!");
      return;
    }
    setloading(true);
    setnewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: promt,
        threadId: currentThreadId,
      }),
    };
    try {
      const respond = await fetch("http://localhost:8080/api/chat", options);
      const res = await respond.json();
      setreply(res.reply);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setloading(false);
  };
  const dropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();

    setUser(null);

    setShowLogin(true);
    setShowRegister(false);
  };
  return (
    <div className="chartwindow">
      <div className="navbar">
        <span>
          ZenGpt <i className="fa-solid fa-chevron-down"></i>{" "}
        </span>
        <div className="usericonDiv">
          <span className="userIcon" onClick={dropdown}>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="ddi ">
            <i className="fa-solid fa-user"></i>&nbsp;&nbsp;
            {user?.name}
          </div>
          <div className="ddi" onClick={toggleTheme}>
            <i className="fa-regular fa-moon"></i>&nbsp;&nbsp;
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </div>

          <div className="ddi">
            <i className="fa-solid fa-cloud-arrow-up"></i> &nbsp;&nbsp;Upgrade
            plan
          </div>

          {/* {user && ( */}
          <div className="ddi logoutButton" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Logout
          </div>
          {/* )}  */}
        </div>
      )}
      <Chat></Chat>
      <ScaleLoader
        color={theme === "dark" ? "white" : "black"}
        loading={loading}
      ></ScaleLoader>
      <div className="chatInput">
        <div className="inputbox">
          <input
            placeholder="Ask anything"
            value={promt}
            onChange={(e) => setpromt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          <b>ZenGPT</b> can make mistakes.
          {/* <b>
            Some features like user verification etc need to be Implmented
          </b>{" "} */}
        </p>
      </div>
    </div>
  );
}
export default ChatWindow;
