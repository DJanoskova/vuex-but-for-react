import { useEffect } from 'react';
import { useAction, useGetter } from 'vuex-but-for-react';

const PostsPage = () => {
  const handleFetch = useAction('POSTS_FETCH');
  const posts = useGetter('posts');

  useEffect(() => {
    handleFetch();
  }, [handleFetch])

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default PostsPage;
