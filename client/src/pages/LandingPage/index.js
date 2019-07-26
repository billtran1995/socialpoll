import React from "react";
import { Button } from "semantic-ui-react";

import "./styles/LandingStyles.css";

const Landing = ({ auth }) => {
  return (
    <div className="Landing">
      <div className="Landing-title">SocialPoll</div>
      <div className="Landing-button">
        <Button color="green" size="massive" onClick={auth.login}>
          Sign Up or Log In
        </Button>
      </div>
    </div>
  );
};

export default Landing;
