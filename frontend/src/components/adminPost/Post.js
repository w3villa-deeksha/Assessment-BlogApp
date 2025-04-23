import "./Post.css";

import Tag from "../tag/Tag";
import LikeIcon from "../../icons/like";
import DeleteIcon from "../../icons/delete";

const AdminPost = ({ username, head, body, likes, tags, handleDelete }) => {
  return (
    <div className="adminPostContainer">
      <div className="postHeader">
        <div
          dangerouslySetInnerHTML={{ __html: head }}
          className="postHead cormorant-garamond-bold"
        />
        <div>
          <DeleteIcon onClick={handleDelete} />
        </div>
      </div>
      <div className="postAuthor">Author: {username}</div>
      <p
        dangerouslySetInnerHTML={{ __html: body }}
        className="postBody cormorant-upright-regular"
      />
      <div className="postFooter">
        <div className="postTags">
          {tags.map((tag) => (
            <Tag name={tag} key={tag} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LikeIcon filled={true} />
          {likes.length}
        </div>
      </div>
    </div>
  );
};

export default AdminPost;
