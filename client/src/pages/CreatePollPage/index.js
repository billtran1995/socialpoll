import React from "react";
import { withRouter } from "react-router-dom";

import useCreatePollFormState from "./state";
import { useAuth0 } from "../../auth/auth0-wrapper";
import NewPollForm from "./components/NewPollForm";

const NewPollFormContainer = ({ history }) => {
  const {
    user: { _id }
  } = useAuth0();

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
  ] = useCreatePollFormState(history, _id);

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
