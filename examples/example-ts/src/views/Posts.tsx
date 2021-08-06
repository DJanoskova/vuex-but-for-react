import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useAction, useGetter } from "vuex-but-for-react";
import PostDelete from "../components/PostDelete";

const Posts = () => {
  const handleFetch = useAction('FETCH_POSTS');
  const posts = useGetter('posts');

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          {post.body}
          <br />
          <Link to={`/posts/${post.id}`}>Detail</Link>
          <br />
          <PostDelete id={post.id} />
        </div>
      ))}
    </div>
  )
}

export default Posts;