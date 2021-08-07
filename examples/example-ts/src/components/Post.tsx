import React, { memo } from "react";
import { Link } from "react-router-dom";

import PostDelete from "./PostDelete";

const Post = ({ post }) => {
  return (
    <div key={post.id} className="post">
      <h3>{post.title}</h3>
      {post.body}
      <br />
      <Link to={`/posts/${post.id}`}>Detail</Link>
      <br />
      <PostDelete id={post.id} />
    </div>
  )
}

// Wrapping the post in memo() will prevent re-renders when a post is removed
// the other post objects aren't re-created, so a shallow comparison is enough
export default memo(Post);
