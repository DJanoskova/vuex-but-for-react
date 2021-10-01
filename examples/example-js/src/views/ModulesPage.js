import { useEffect } from 'react';
import { useAction, useGetter } from 'vuex-but-for-react';

const ModulesPage = () => {
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

export default ModulesPage;
