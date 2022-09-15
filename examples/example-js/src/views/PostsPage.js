import { useEffect } from 'react';
import { useAction, useGetter, useMutation } from 'vuex-but-for-react';

const PostsPage = () => {
  const handleFetch = useAction('POSTS_FETCH');
  const handleRemove = useMutation('POST_REMOVE');
  const blog = useGetter('blog');
  const test = useGetter('test');

  useEffect(() => {
    handleFetch();
  }, [handleFetch])

  useEffect(() => {
    console.log('blog changed', blog)
  }, [blog])

  useEffect(() => {
    console.log('test changed', test)
  }, [test])

  // You can use useActionOnMount() instead of useAction and useEffect!
  // useActionOnMount('POSTS_FETCH');

  return (
    <ul className="list-none">
      {blog.posts.map(post => (
        <li key={post.id} className="blog-item">
          <button className="button-x" onClick={() => handleRemove(post.id)}>
            x
          </button>
          {post.title}
        </li>
      ))}
    </ul>
  )
}

export default PostsPage;
