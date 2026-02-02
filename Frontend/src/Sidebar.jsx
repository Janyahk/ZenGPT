import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currentThreadId,
    setnewChat,
    setcurrentThreadId,
    setreply,
    setprevChats,
    setpromt,
  } = useContext(MyContext);
  const token = localStorage.getItem("token");

  const getAllThreads = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/thread", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token
        },
      });
      if (!res.ok) throw new Error("Unauthorized");

      const r = await res.json();
      const filterdata = r.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filterdata);
      setAllThreads(filterdata);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllThreads();
  }, [currentThreadId]);
  const creatnewchat = () => {
    setnewChat(true);
    setpromt("");
    setreply(null);
    setcurrentThreadId(uuidv1());
    setprevChats([]);
  };

  const changethread = async (newThreadId) => {
    setcurrentThreadId(newThreadId);
    try {
      const res = await fetch(
        `/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const r = await res.json();
      setprevChats(r);
      setnewChat(false);
      setreply(null);
    } catch {}
  };
  const deletethread = async (deletethreadId) => {
    try {
      const res = await fetch(
        `/api/thread/${deletethreadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const r = await res.json();
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId != deletethreadId),
      );

      if (deletethreadId === currentThreadId) {
        creatnewchat();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <section className="sidebar">
        <button onClick={creatnewchat}>
          <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>
        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={(e) => changethread(thread.threadId)}
              className={
                thread.threadId === currentThreadId ? "highlight" : " "
              }
            >
              {thread.title}
              <i
                className="fa-solid fa-trash-can"
                onClick={(e) => {
                  e.stopPropagation();
                  deletethread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>By Janyahk &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
