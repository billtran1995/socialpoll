import Auth0 from "auth0-js";
import history from "../history/history";
import initApis from "../api";

class Auth {
  auth0 = new Auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH_DOMAIN,
    clientID: process.env.REACT_APP_AUTH_CLIENT_ID,
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI,
    responseType: "token id_token",
    scope: "openid profile"
  });

  accessToken;
  idToken;
  expiresAt;
  profile;

  localLogin = () => {};
  localLogout = () => {};

  login = () => {
    this.auth0.authorize();
  };

  logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("attemptPage");

    this.accessToken = null;
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;

    this.auth0.logout({
      returnTo: window.location.origin
    });
    this.localLogout();

    history.replace("/");
  };

  setSession = authResult => {
    localStorage.setItem("isLoggedIn", true);

    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  };

  getAccessToken = () => {
    return this.accessToken;
  };

  getIdToken = () => {
    return this.idToken;
  };

  getProfile = () => {
    return this.profile;
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        initApis(this.idToken);
        this.localLogin();
        history.replace(localStorage.getItem("attemptPage") || "/home");
      } else if (err) {
        history.replace("/");
        console.log(err);
      }
    });
  };

  silentAuth = () => {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        initApis(this.idToken);
        this.localLogin();
      } else if (err) {
        this.logout();
        console.log(err);
      }
    });
  };

  isAuthenticated = () => {
    return new Date().getTime() < this.expiresAt;
  };
}

export default Auth;
