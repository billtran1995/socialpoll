import { useState } from "react";

import { createPoll } from "../../../api";

const useCreatePollFormState = (history, userId) => {
  const [question, setQuestion] = useState("");
  const [choiceGroup, setChoiceGroup] = useState(["", ""]);
  const [isReview, setIsReview] = useState(false);
  const [errors, setErrors] = useState([]);

  function handleQuestionChange(e) {
    setQuestion(e.target.value);
  }

  function handleAddChoice() {
    if (choiceGroup.length < 6) {
      setChoiceGroup([...choiceGroup, ""]);
    }
  }

  function handleRemoveChoice() {
    if (choiceGroup.length > 2) {
      setChoiceGroup(choiceGroup.slice(0, choiceGroup.length - 1));
    }
  }

  function onChoiceChange(e, i) {
    let newOpt = choiceGroup.map((input, index) => {
      if (index === i) {
        return e.target.value;
      }

      return input;
    });

    setChoiceGroup(newOpt);
  }

  function validateForm() {
    let err = new Set();

    if (question) {
      if (!/^[a-zA-Z0-9,.?' ]+$/.test(question)) {
        err.add("Only alphanumerics and ,.? are allowed.");
      }

      if (question.length > 1000) {
        err.add(
          "Only 1000 characters are allowed for question (including punctuations and spaces)."
        );
      }
    } else {
      err.add("Make sure question is filled.");
    }

    if (choiceGroup.every(choice => choice !== "")) {
      if (choiceGroup.some(choice => !/^[a-zA-Z0-9,.?' ]+$/.test(choice))) {
        err.add("Only alphanumerics and ,.? are allowed.");
      }

      if (choiceGroup.some(choice => choice.length > 90)) {
        err.add(
          "Only 90 characters are allowed for each choice (including punctuations and spaces)."
        );
      }
    } else {
      err.add("Make sure all choices are filled.");
    }

    if (err.size !== 0) {
      setErrors(Array.from(err));
    } else {
      setErrors([]);
      setIsReview(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isReview) {
      createPoll({
        question: question.trim(),
        choices: JSON.stringify(choiceGroup.map(choice => choice.trim())),
        userId
      })
        .then(({ data, status }) => {
          if (status === 200) {
            history.replace("/home");
          }
        })
        .catch(err => {
          setErrors(err.message);
          setIsReview(false);
        });
    } else {
      validateForm();
    }
  }

  function backToFilling() {
    setIsReview(false);
  }

  return [
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
  ];
};

export default useCreatePollFormState;
