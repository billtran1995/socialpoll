import React, { useState, useContext } from "react";
import { Button, Header, Modal, Form, Label, Message } from "semantic-ui-react";
import { faCheck, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PollListContext from "../context";

const VoteForm = ({
  poll,
  isVoted,
  setIsVoted,
  closeModal,
  getVotedChoice
}) => {
  const { handleVote } = useContext(PollListContext);
  const [voteValue, setVoteValue] = useState("");
  const [message, setmessage] = useState("");

  function handleCloseModal() {
    closeModal();
  }

  function handleOnVoteChange(e, { value }) {
    setVoteValue(value);
  }

  function handleSubmitVote() {
    if (voteValue) {
      return handleVote(poll._id, voteValue, err => {
        if (!err) {
          setmessage("");
          setIsVoted(voteValue);
          return closeModal();
        }

        return setmessage(err.message);
      });
    }

    return setmessage("Please fill out the form before submit!");
  }

  return (
    <Modal open={true} onClose={handleCloseModal}>
      <Modal.Header>{isVoted ? "You voted!" : "Vote"}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>{poll.question}</Header>
          <br />
        </Modal.Description>
        <Form error>
          {poll.choices.map(choice => {
            return isVoted ? (
              <Form.Radio
                key={choice.choice}
                label={choice.choice}
                checked={choice.choice === getVotedChoice()}
                disabled
              />
            ) : (
              <Form.Radio
                key={choice.choice}
                label={choice.choice}
                value={choice.choice}
                checked={voteValue === choice.choice}
                onChange={handleOnVoteChange}
              />
            );
          })}
          {message && <Message error content={message} />}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button as="div" labelPosition="right" onClick={handleCloseModal}>
          <Button icon color="black" pointing="left">
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <Label basic>Back</Label>
        </Button>
        {!isVoted && (
          <Button as="div" labelPosition="left">
            <Label basic>Submit Vote</Label>
            <Button icon color="green" onClick={handleSubmitVote}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default VoteForm;
