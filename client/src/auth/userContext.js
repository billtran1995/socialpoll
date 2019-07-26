import React, { createContext } from "react";

const UserContext = createContext(null);

export const withAuth = Component => props => (
  <UserContext.Consumer>
    {userId => <Component {...props} userId={userId} />}
  </UserContext.Consumer>
);

export default UserContext;
