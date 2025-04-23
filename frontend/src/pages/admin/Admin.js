import { useEffect, useState } from "react";
import AdminPost from "../../components/adminPost/Post";
import ArrowIcon from "../../icons/arrow";
import "./Admin.css";

const AdminPage = ({ setUsername }) => {
  const [users, setUsers] = useState({});
  const [reports, setReports] = useState([]);
  const [openUserPosts, setOpenUserPosts] = useState({});

  const getPosts = () => {
    fetch("http://localhost:5000/get_user_posts", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((res) =>
      res.json().then((j) => {
        setUsers(j.posts);
      }),
    );
  };

  const getReports = () => {
    fetch("http://localhost:5000/get_reports", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((res) =>
      res.json().then((j) => {
        setReports(j.posts);
      }),
    );
  };

  useEffect(() => {
    getPosts();
    getReports();
  }, []);

  const toggleUserPosts = (username) => {
    setOpenUserPosts((prevState) => ({
      ...prevState,
      [username]: !prevState[username],
    }));
  };

  const handleDeletePost = (time) =>
    fetch("http://localhost:5000/delete_post", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        time: time,
      }),
    }).then((res) =>
      res.json().then((j) => {
        showSnackbar(j.message);
        getPosts();
        getReports();
      }),
    );

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
    <>
      <button onClick={() => setUsername("")} className="logoutButton">
        Logout
      </button>
      <div className="heading">User Posts</div>
      {Object.entries(users).map((user) => {
        const username = user[0];
        const posts = user[1];

        return (
          <div key={username}>
            <div
              className="userContainer"
              onClick={() => toggleUserPosts(username)}
            >
              {username}
              <ArrowIcon isOpen={openUserPosts[username]} />
            </div>

            {openUserPosts[username] && (
              <div className="adminPosts">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <AdminPost
                      key={post.time}
                      curUser=""
                      username={post.username}
                      head={post.head}
                      body={post.body}
                      likes={post.likes}
                      tags={post.tags}
                      time={post.time}
                      handleDelete={() => handleDeletePost(post.time)}
                    />
                  ))
                ) : (
                  <div>"No p at the moment"</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="heading">Reported Posts</div>
      {reports.length > 0 ? (
        reports.map((post) => (
          <AdminPost
            key={post.time}
            curUser=""
            username={post.username}
            head={post.head}
            body={post.body}
            likes={post.likes}
            tags={post.tags}
            time={post.time}
            handleDelete={() => handleDeletePost(post.time)}
          />
        ))
      ) : (
        <div style={{ marginLeft: "2rem" }}>No reports at the moment</div>
      )}
    </>
  );
};

export default AdminPage;
