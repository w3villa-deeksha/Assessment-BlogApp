import "./Home.css";
import { useState, useEffect } from "react";

import Post from "../../components/post/Post";
import NewPost from "../../components/newPost/NewPost";
import CreateIcon from "../../icons/create";
import HomeIcon from "../../icons/home";
import LogoutIcon from "../../icons/logout";

const Home = ({ setUsername, username }) => {
  const [posts, setPosts] = useState([]);
  const [postTags, setPostTags] = useState([]);
  const [postHead, setPostHead] = useState("");
  const [editingPostTime, setEditingPostTime] = useState(0);
  const [postBody, setPostBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const getPosts = () => {
    fetch("http://127.0.0.1:5000/get_posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json().then((j) => setPosts(j.posts)));
  };

  const toggleCreate = () => {
    document.getElementById("newPostHeading").innerText = "";
    document.getElementById("newPostBody").innerText = "";
    document.getElementById("newPostTags").innerText = "";

    setIsPosting(!isPosting);
    setIsEditing(false);
    setPostHead("");
    setPostBody("");
    setPostTags([]);
  };

  const handlePost = () => {
    if (isEditing) {
      updateEditedPost();
    } else {
      fetch("http://127.0.0.1:5000/add_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          head: postHead,
          body: postBody,
          tags: postTags,
        }),
      }).then((res) => {
        if (res.status === 201) {
          setIsPosting(!isPosting);
          setPostHead("");
          setPostBody("");
          setPostTags([]);
          getPosts();
        }
        res.json().then((e) => showSnackbar(e.message));
      });
    }
  };

  const handlePreview = () => {
    if (!isPreviewing && postHead !== "" && postBody !== "")
      setIsPreviewing(true);
    else if (!isPreviewing)
      showSnackbar("Add a body and heading to the post before proceeding");
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

  const handleEditPost = async (time, head, body, tags) => {
    document.getElementById("newPostHeading").innerText = head;
    document.getElementById("newPostBody").innerText = body;
    document.getElementById("newPostTags").innerText = tags.join(",");

    setIsEditing(true);
    setEditingPostTime(time);
    setPostHead(head);
    setPostBody(body);
    setPostTags(tags);

    await new Promise((resolve) => setTimeout(() => resolve()));

    setPostHead((head) => head);
  };

  const updateEditedPost = () => {
    fetch("http://localhost:5000/update_post", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        time: editingPostTime,
        head: postHead,
        body: postBody,
        tags: postTags,
      }),
    }).then((res) =>
      res.json().then((j) => {
        showSnackbar(j.message);
        setIsEditing(false);
        setPostHead("");
        setPostBody("");
        setPostTags([]);
        getPosts();
      }),
    );
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
      }),
    );

  const changePostHead = (event) => setPostHead(event.target.innerText);
  const changePostBody = (event) => setPostBody(event.target.innerText);
  const changePostTags = (event) => {
    let val = event.target.innerText.split(",");
    setPostTags(event.target.innerText === "" ? [] : val);
  };

  useEffect(() => getPosts(), []);

  return (
    <>
      <div className="App">
        <div className="navigationBar">
          <div className="navigationItem selected">
            <HomeIcon filled={true} />
            Home
          </div>
          <div onClick={() => toggleCreate()} className="navigationItem">
            <CreateIcon filled={false} />
            Create
          </div>
          <div className="navigationItem" onClick={() => setUsername("")}>
            <LogoutIcon filled={false} />
            Logout
          </div>
        </div>
        <div className="navigationDrawer">
          <div className="navigationItem selected">
            <HomeIcon filled={true} />
            Home
          </div>
          <div onClick={() => toggleCreate()} className="navigationItem">
            <CreateIcon filled={false} />
            Create
          </div>
          <div className="navigationItem" onClick={() => setUsername("")}>
            <LogoutIcon filled={false} />
            Logout
          </div>
        </div>
        <div className="posts">
          {posts.map((post) => (
            <Post
              key={post.time + post.head}
              time={post.time}
              curUser={username}
              username={post.username}
              editable={true}
              handleEdit={() =>
                handleEditPost(post.time, post.head, post.body, post.tags)
              }
              handleDelete={() => handleDeletePost(post.time)}
              head={post.head}
              tags={post.tags}
              body={post.body}
              likes={post.likes}
            />
          ))}
        </div>

        <div
          className={isEditing || isPosting ? "createPost" : "hide"}
          onClick={() => {
            setIsPosting(false);
            setIsEditing(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={isEditing || isPosting ? "createContainer" : "hide"}
          >
            <div
              contentEditable={true}
              className="newPostHeading cormorant-garamond-bold"
              onInput={changePostHead}
              id="newPostHeading"
              type="text"
            />
            <div
              contentEditable={true}
              className="newPostBody cormorant-upright-regular"
              onInput={changePostBody}
              id="newPostBody"
              type="text"
            />
            <div
              contentEditable={true}
              className="newPostTags"
              onInput={changePostTags}
              id="newPostTags"
              type="text"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "12rem",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <button className="secondary-btn" onClick={handlePreview}>
                Preview
              </button>
              <button onClick={handlePost}>Post</button>
            </div>
          </div>
        </div>

        {isPreviewing && (
          <div
            className="previewPost"
            onClick={() => setIsPreviewing(!isPreviewing)}
          >
            <div
              className="previewContainer"
              onClick={(event) => event.stopPropagation()}
            >
              <NewPost
                curUser=""
                username={username}
                body={postBody.replace(/\n/g, "<br/>")}
                head={postHead}
                likes={postTags}
                tags={postTags}
                time={0}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
