import React, { useEffect } from "react";
import { useAction, useGetter } from "vuex-but-for-react";

import Post from "../components/Post";

const PostsPage = () => {
  const handleFetch = useAction('FETCH_POSTS');
  const posts = useGetter('posts');

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostsPage;
