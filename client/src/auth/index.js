import { useState, useEffect } from "react";
import axios from "axios";
import AuthContext, { withAuth } from "./authContext";
import Auth from "./Auth";
import UserContext from "./userContext";

const useAuthenticationState = (auth, history) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [checkingSession, setCheckingSession] = useState(true);

  auth.localLogin = () => setIsLoggedIn(true);
  auth.localLogout = () => setIsLoggedIn(false);

  const getUser = (sub, nickname, picture) => {
    axios
      .post(
        "/api/user/",
        { id: sub, nickName: nickname, picture },
        {
          headers: { Authorization: `Bearer ${auth.getIdToken()}` }
        }
      )
      .then(({ data, status }) => {
        if (status === 200) {
          setUser(data.user);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (history.location.pathname === "/callback") {
      setCheckingSession(false);
      return;
    }

    if (localStorage.getItem("isLoggedIn") === "true") {
      auth.silentAuth();
    }
    setCheckingSession(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const { sub, nickname, picture } = auth.getProfile();

      getUser(sub, nickname, picture);
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  return [user, checkingSession, isLoggedIn];
};

export default new Auth();

export { AuthContext, UserContext, withAuth, useAuthenticationState };
