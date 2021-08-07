import { useAction, useGetter } from 'vuex-but-for-react';
import { useEffect } from 'react';

const Posts = () => {
  const action = useAction('POSTS_FETCH')

  useEffect(() => {
    action()
  }, [action])

  const posts = useGetter('posts');

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default Posts