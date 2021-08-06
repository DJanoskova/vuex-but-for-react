import React from 'react';

import { useAction, useGetter } from '../contx';

const Posts = () => {
  const handleFetch = useAction('FETCH_POSTS');
  const posts = useGetter('posts');

  const handleClick = async () => {
    const result = await handleFetch()
    console.log('rrr', result)
  }

  console.log('posts', posts)

  return (
    <button onClick={handleClick}>Fetch posts</button>
  )
}

export default Posts;
