import React from "react";
import { Button } from "@material-ui/core";
import "../../styles.scss";

function Landing(props) {
  return (
    <div>
      <div className="landing-container">
        <div className="landing-image">
          <img src="/images/banner-dark-blue.png" alt="CupOSugah"></img>
        </div>
        <h2 className="landing-title">Your neighbourhood social network!</h2>
        <div className="button-container">
          <Button variant="contained" color="primary" href="/login">
            LOGIN
          </Button>
          <Button variant="contained" color="primary" href="/register">
            REGISTER
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
