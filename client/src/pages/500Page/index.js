import React from "react";

import "./styles/InternalServerError.css";

const InternalErrorPage = () => {
  return (
    <>
      <div className="internal-error">
        <span className="ec ec-confounded" />
      </div>
      <div className="internal-error-message">
        Something wrong happened to server...
      </div>
    </>
  );
};

export default InternalErrorPage;
