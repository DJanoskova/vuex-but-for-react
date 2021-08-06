import React, { FunctionComponent } from 'react';
import { useAction } from "vuex-but-for-react";

interface IProps {
  id: number
}

const PostDelete: FunctionComponent<IProps> = ({ id }) => {
  const onDelete = useAction('DELETE_POST');

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  }

  return (
    <button onClick={handleDelete} className="link">
      Delete post
    </button>
  )
}

export default PostDelete;
