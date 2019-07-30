import React from "react";
import {
  Form,
  Input,
  Segment,
  Header,
  Button,
  List,
  Message
} from "semantic-ui-react";
import IconButton from "../../shared/IconButton";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import "../styles/NewPollFormStyles.css";

const TextArea = ({ value, handleOnChange }) => (
  <textarea
    style={{ resize: "none" }}
    value={value}
    onChange={handleOnChange}
  />
);

const NewPollForm = ({
  question,
  choiceGroup,
  isReview,
  handleQuestionChange,
  handleAddChoice,
  handleRemoveChoice,
  onChoiceChange,
  handleSubmit,
  backToFilling,
  errors
}) => {
  const hasErrors = errors.length !== 0;

  return (
    <div className="NewPollForm">
      <Segment padded="very">
        <Header as="h1" textAlign="center">
          {!isReview ? "Create Poll" : "Review Poll"}
        </Header>
        <Form error onSubmit={handleSubmit}>
          {isReview ? (
            <>
              <Header size="large">{question}</Header>
              <List>
                {choiceGroup.map((choice, index) => {
                  const textNumber = index + 1;

                  return <List.Item key={textNumber}>{choice}</List.Item>;
                })}
              </List>
              <p>
                <span style={{ color: "red" }}>*Note:</span> After submitting,
                you will not be able to edit again. Please make sure everything
                looks right.
              </p>
            </>
          ) : (
            <>
              <Form.Field
                control={TextArea}
                label="Your Poll:"
                value={question}
                handleOnChange={handleQuestionChange}
              />
              {choiceGroup.map((choice, index) => {
                const textNumber = index + 1;

                return (
                  <Form.Field
                    key={textNumber}
                    control={Input}
                    label={`Choice ${textNumber}:`}
                    value={choice}
                    onChange={e => onChoiceChange(e, index)}
                  />
                );
              })}
            </>
          )}
          {isReview ? (
            <>
              {hasErrors && (
                <Message error header="Please correct all errors to submit." />
              )}
              <Button onClick={backToFilling}>Back</Button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "50px" }}>
                <IconButton
                  classNames="NewPollForm-removeChoicebtn"
                  icon={faMinus}
                  popupContent="Remove choice"
                  handleOnClick={handleRemoveChoice}
                  hasBox={false}
                  popupPosition="bottom center"
                />
                <IconButton
                  classNames="NewPollForm-addChoicebtn"
                  icon={faPlus}
                  popupContent="Add choice"
                  handleOnClick={handleAddChoice}
                  hasBox={false}
                  popupPosition="bottom center"
                />
              </div>
              {hasErrors && (
                <Message
                  error
                  header="Please correct the following error(s):"
                  list={errors}
                />
              )}
            </>
          )}
          <Button positive disabled={isReview && hasErrors}>
            {!isReview ? "Next" : "Submit"}
          </Button>
        </Form>
      </Segment>
    </div>
  );
};

export default NewPollForm;
