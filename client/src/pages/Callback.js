import React, { useEffect } from "react";
import DimLoader from "./shared/DimLoader";

const Callback = ({ handleAuthentication }) => {
  useEffect(() => {
    handleAuthentication();
    // eslint-disable-next-line
  }, []);

  return <DimLoader text="Loading..." />;
};

export default Callback;
