import React, { useState } from "react";
import {
  Segment,
  Comment,
  Header,
  Divider,
  Transition,
  Button
} from "semantic-ui-react";
import moment from "moment";

import CreateCommentForm from "./CreateCommentForm";

const CommentsSection = ({ poll, updatePoll }) => {
  const { comments } = poll;
  const [isHidden, setIsHidden] = useState(false);

  const toggleComments = () => {
    setIsHidden(!isHidden);
  };

  return (
    <Comment.Group>
      <Header as="h2">
        {comments.length} Comment{comments.length > 1 && "s"}
        <Button
          toggle
          floated="right"
          active={!isHidden}
          onClick={toggleComments}
        >
          {isHidden ? "Show" : "Hide"}
        </Button>
      </Header>
      <Divider />
      <Transition visible={!isHidden} animation="fade down" duration={500}>
        <div>
          {comments.length > 0 ? (
            comments.map(comment => (
              <Segment key={comment._id}>
                <Comment>
                  <Comment.Avatar src={comment.author.picture} />
                  <Comment.Content>
                    <Comment.Author as="div">
                      {comment.author.nickName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>
                        {moment(comment.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.body}</Comment.Text>
                  </Comment.Content>
                </Comment>
              </Segment>
            ))
          ) : (
            <h5>Currently, there're no comments...</h5>
          )}
        </div>
      </Transition>
      <CreateCommentForm poll={poll} updatePoll={updatePoll} />
    </Comment.Group>
  );
};

export default CommentsSection;
