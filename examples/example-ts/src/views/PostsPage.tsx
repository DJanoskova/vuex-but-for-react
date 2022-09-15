import React, { useEffect } from "react";
import { useAction, useGetter } from "vuex-but-for-react";

import { PostType } from '../types/types';

import Post from "../components/Post";

const PostsPage = () => {
  const handleFetch = useAction('POSTS_FETCH');
  const posts = useGetter<PostType[]>('posts');

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
