import React from 'react';

import { useAction, useGetter } from '../contx/storeContext';

const Posts = () => {
  const handleFetch = useAction('FETCH_POSTS');
  const posts = useGetter('posts');

  const handleClick = () => {
    handleFetch()
  }

  console.log('posts', posts)

  return (
    <button onClick={handleClick}>Fetch posts</button>
  )
}

export default Posts;
