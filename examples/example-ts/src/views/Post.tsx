import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useAction } from "vuex-but-for-react";

interface IProps extends RouteComponentProps<{ id: string }>{}

const Post: FunctionComponent<IProps> = ({ match }) => {
  const [postData, setPostData] = useState(null);
  const handleFetch = useAction('FETCH_POST');

  useEffect(() => {
    async function fetchFn() {
      const data = await handleFetch(match.params.id);
      setPostData(data);
    }
    fetchFn();
  }, [handleFetch, match.params.id]);

  if (!postData) return <>Loading...</>;

  return (
    <div className="post">
      <h1>{postData.title}</h1>
      {postData.body}
    </div>
  )
}

export default Post;
