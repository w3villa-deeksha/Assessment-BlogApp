import "./NewPost.css";

import LikeIcon from "../../icons/like";
import { useState } from "react";
import { useEffect } from "react";
import Tag from "../tag/Tag";

const NewPost = ({ curUser, username, head, body, likes, tags, time }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setLikeCount(likes.length);
    likes.forEach((like) => {
      if (like === curUser) {
        setIsLiked(true);
        setLikeCount(likes.length - 1);
      }
    });
  }, [likes, curUser]);

  const handleClick = () => {
    setIsLiked(!isLiked);
    fetch("http://127.0.0.1:5000/set_like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: curUser,
        postID: time,
      }),
    });
  };

  return (
    <div className="mpostContainer">
      <div
        dangerouslySetInnerHTML={{ __html: head }}
        className="mpostHead cormorant-garamond-bold"
      />
      <div className="mpostAuthor">Author: {username}</div>
      <p
        dangerouslySetInnerHTML={{ __html: body }}
        className="mpostBody cormorant-upright-regular"
      />
      <div className="mpostFooter">
        <div className="mpostTags">
          {tags.map((tag) => (
            <Tag name={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewPost;
