import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

// react-bootstrap
import { Form } from "react-bootstrap";

//Material-kit-component styling and components (try to avoid understanding it, too confusing...)
import styles from "./Material-kit-components/landingPage.js";
import Parallax from "./Material-kit-components/Parallax.js";

//Our own style sheet
import "../../styles.scss";

const useStyles = makeStyles(styles);

function Register(props) {

  const [neighbourhoodRedirect, setneighbourhoodRedirect] = useState(false);
  const [coordinates, setCoordinates] = useState({ longitude: null, latitude: null });

  const classes = useStyles();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(e => {
      setCoordinates({
        longitude: e.coords.longitude,
        latitude: e.coords.latitude
      });
    });
  }, []);

  const onSubmitHandler = function (event) {
    const address = event.target.elements["address"].value;
    const city = event.target.elements["city"].value;
    const firstName = event.target.elements['formBasicFirstname'].value;
    const lastName = event.target.elements['formBasicLastname'].value;
    const email = event.target.elements['formBasicEmail'].value;
    const password = event.target.elements['formBasicPassword'].value;
    const url = event.target.elements['formBasicProfileURL'].value;
    const bio = event.target.elements['formBasicBio'].value;
    const phoneNumber = event.target.elements['formBasicPhoneNumber'].value;

    event.preventDefault();
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${city}+CA&key=${process.env.REACT_APP_GEOCODING_KEY}`
      )
      .then((response) => {
        const coordinates = response.data.results[0].geometry.location;
        const formattedCoordinates = `(${coordinates.lat}, ${coordinates.lng})`;
        registerUser({
          firstName,
          lastName,
          email,
          password,
          coordinates: formattedCoordinates,
          url,
          bio,
          phoneNumber
        });
      });
  };

  const registerUser = function (registrationData) {
    axios.post("/users/register", registrationData)
      .then((response) => {
        setneighbourhoodRedirect(true);
        props.register(response.data);
      }

      )
      .catch((err) => {
        alert("E-Mail is already registered");
      });
  };

  if (neighbourhoodRedirect) {
    return (
      <Redirect to="/selectNeighbourhood" />);
  }

  return (
    <div>
      <Parallax filter image={require("../../assets/img/neighbours.jpg")}>
        <div className={classes.containerLogin}>
          <Form onSubmit={onSubmitHandler} className="registration-form">
            <Form.Group controlId="formBasicFirstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="firstname" placeholder="First name" />
            </Form.Group>
            <Form.Group controlId="formBasicLastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="lastname" placeholder="Last name" />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control type="streetName" placeholder="Street number and name" />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Control type="city" placeholder="City" />
            </Form.Group>
            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control placeholder="Enter Phone Number" />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicProfileURL">
              <Form.Label>Photo (URL or blank)</Form.Label>
              <Form.Control type="url" />
            </Form.Group>
            <Form.Group controlId="formBasicBio">
              <Form.Label>Write a Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                type="textarea"
                placeholder="Write something about yourself"
              />
            </Form.Group>
            <Button variant="contained" color="primary" type="submit">
              Register
            </Button>
          </Form>
        </div>
      </Parallax>
    </div>
  );
}

export default Register;
