import React, { useContext } from "react";
import { Route } from "react-router-dom";
import DimLoader from "./DimLoader";

import { AuthContext } from "../../auth";

const SecuredRoute = ({ exact, path, render, checkingSession }) => {
  const auth = useContext(AuthContext);

  localStorage.setItem("attemptPage", window.location.pathname);
  if (checkingSession) {
    return null;
  }
  if (!auth.isAuthenticated()) {
    auth.login();
    return <DimLoader text="Logging in..." />;
  } else {
    return (
      <Route
        exact={exact}
        path={path}
        render={props => render({ ...props, auth })}
      />
    );
  }
};

export default SecuredRoute;
