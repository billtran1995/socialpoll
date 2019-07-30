import React from "react";
import { withRouter } from "react-router-dom";

import useCreatePollFormState from "./state";

import NewPollForm from "./components/NewPollForm";

const NewPollFormContainer = ({ userId, history }) => {
  const [
    question,
    choiceGroup,
    isReview,
    errors,
    handleQuestionChange,
    handleAddChoice,
    handleRemoveChoice,
    handleSubmit,
    onChoiceChange,
    backToFilling
  ] = useCreatePollFormState(history, userId);

  return (
    <NewPollForm
      question={question}
      choiceGroup={choiceGroup}
      isReview={isReview}
      handleQuestionChange={handleQuestionChange}
      handleAddChoice={handleAddChoice}
      handleRemoveChoice={handleRemoveChoice}
      onChoiceChange={onChoiceChange}
      handleSubmit={handleSubmit}
      backToFilling={backToFilling}
      errors={errors}
    />
  );
};

export default withRouter(NewPollFormContainer);
