import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

// react-bootstrap
import Form from "react-bootstrap/Form";

//Material-kit-component styling and components (try to avoid understanding it, too confusing...)
import styles from "./Material-kit-components/landingPage.js";
import Parallax from "./Material-kit-components/Parallax.js";

//Our own style sheet
import "../../styles.scss";

const useStyles = makeStyles(styles);

function Login(props) {
  const [homeRedirect, sethomeRedirect] = useState(false);
  const classes = useStyles();

  //Hook from React-hook-form
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (userInfo) => {
    axios
      .post("/users/login", userInfo)
      .then((response) => {
        sethomeRedirect(true);
        props.login(response.data);
      })
      .catch((err) => alert("Wrong credentials!"));
  };

  if (homeRedirect) {
    return <Redirect to="/home" />;
  }
  return (
    <div>
      <Parallax filter image={require("../../assets/img/neighbours.jpg")}>
        <div className={classes.containerLogin}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                ref={register({ required: true })}
              />
              {errors.email && (
                <span className="error-message">This field is required</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                ref={register({ required: true })}
              />
              {errors.password && (
                <span className="error-message">This field is required</span>
              )}
            </Form.Group>
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </Form>
        </div>
      </Parallax>
    </div>
  );
}

export default Login;
