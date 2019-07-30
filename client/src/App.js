import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import history from "./history/history";
import { AuthContext, useAuthenticationState, UserContext } from "./auth";
import Navbar from "./pages/shared/Navbar";
import SecuredRoute from "./pages/shared/SecuredRoute";
import PageContent from "./pages/shared/PageContent";
import "./App.css";

// Pages
import Callback from "./pages/Callback";
import Landing from "./pages/LandingPage";
import PollListPage from "./pages/PollsListPage";
import CreatePollPage from "./pages/CreatePollPage";
import PollStatsPage from "./pages/PollStatsPage";

const App = () => {
  const auth = useContext(AuthContext);
  const [user, checkingSession] = useAuthenticationState(auth, history);

  const handleAuthentication = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
    }
  };

  return (
    <div className="App">
      <div className="bg" />
      <Container>
        <Navbar />
        <PageContent>
          <UserContext.Provider value={user}>
            <Switch>
              <Route
                exact
                path="/"
                render={() =>
                  auth.isAuthenticated() ? (
                    <Redirect to="/home" />
                  ) : (
                    <Landing auth={auth} />
                  )
                }
              />
              <Route
                exact
                path="/callback"
                render={props => (
                  <Callback
                    {...props}
                    handleAuthentication={() => handleAuthentication(props)}
                  />
                )}
              />
              <SecuredRoute
                exact
                path="/home"
                checkingSession={checkingSession}
                render={props => <PollListPage {...props} />}
              />
              <SecuredRoute
                exact
                path="/create-poll"
                checkingSession={checkingSession}
                render={props => (
                  <CreatePollPage userId={user._id} {...props} />
                )}
              />
              <SecuredRoute
                exact
                path="/poll/info/:id"
                checkingSession={checkingSession}
                render={props => <PollStatsPage {...props} />}
              />
              {/* <SecuredRoute
                exact
                path="/create-poll"
                checkingSession={checkingSession}
                render={props => (
                  <NewPollFormContainer userId={user._id} {...props} />
                )}
              /> */}
            </Switch>
          </UserContext.Provider>
        </PageContent>
      </Container>
    </div>
  );
};

export default App;
