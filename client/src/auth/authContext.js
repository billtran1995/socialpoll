import React, { createContext } from "react";

const AuthContext = createContext(null);

export const withAuth = Component => props => (
  <AuthContext.Consumer>
    {auth => <Component {...props} auth={auth} />}
  </AuthContext.Consumer>
);

export default AuthContext;
