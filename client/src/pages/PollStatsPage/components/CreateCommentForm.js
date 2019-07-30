import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";

import { createComment } from "../../../api";
import { UserContext } from "../../../auth";

const CreateCommentForm = ({ poll, updatePoll }) => {
  const user = useContext(UserContext);
  const [comment, setComment] = useState("");

  const handleOnCommentChange = e => {
    setComment(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    setComment("");

    createComment(poll._id, { userId: user._id, body: comment }).then(
      ({ data, status }) => {
        if (status === 200) {
          let newPoll = { ...poll, comments: [...poll.comments, data.comment] };
          updatePoll(newPoll);
        }
      }
    );
  };

  return (
    <Form reply onSubmit={handleSubmit}>
      <Form.TextArea value={comment} onChange={handleOnCommentChange} />
      <Button content="Submit Comment" primary />
    </Form>
  );
};

export default CreateCommentForm;
