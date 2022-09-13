import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAction } from "vuex-but-for-react";

import { PostType } from "../types/types";

const PostPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [postData, setPostData] = useState<PostType>(null);
  const handleFetch = useAction<PostType>('POST_FETCH');

  useEffect(() => {
    async function fetchFn() {
      const data = await handleFetch(id);
      setPostData(data);
    }
    fetchFn();
  }, [handleFetch, id]);

  if (!postData) return <>Loading...</>;

  return (
    <div className="post">
      <h1>{postData.title}</h1>
      {postData.body}
    </div>
  )
}

export default PostPage;
