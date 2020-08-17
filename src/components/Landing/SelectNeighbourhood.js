import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../../styles.scss";
import { Button } from "@material-ui/core";

function SelectNeighbourhood(props) {

  const [homeRedirect, sethomeRedirect] = useState(false);
  const [neighbourhoods, setNeighbourhoods] = useState([]);

  useEffect(() => {
    axios.get("/neighbourhood/choices")
      .then(
        (response) => {
          setNeighbourhoods(response.data);
        }
      );
  }, []);

  const onAddNeighbourhood = function (event, id) {
    event.preventDefault();
    addNeighbourhood({
      id: id,
      email: props.user.email,
    });
  };

  const addNeighbourhood = function (neighbourID) {
    axios.post("/neighbourhood/addNeighbourhood", neighbourID)
      .then((response) =>
        props.register(response.data),
        sethomeRedirect(true)
      );
  };

  if (homeRedirect) {
    return (
      <Redirect to="/home" />);
  }

  return (!neighbourhoods[0] ? null : (<div className="select-neighbourhood-container">
    <div class="select-neighbourhood-content-wrapper">
      <div className="select-neighbourhood-header">
        <h2>
          Welcome to CupOSugah {props.user.first_name} !
      </h2>
        <h3>Based on your location, we suggest joining one of the following neighbourhoods </h3>
      </div>
      <div className="neighbourhood-choices">
        {neighbourhoods.slice(0, 2).map(i => (
          <figure key={i.id}>
            <img src={i.neighbourhood_photo}></img>
            <Button variant="contained" color="primary" type="submit" onClick={(evt) => onAddNeighbourhood(evt, i.id)}>
              {i.name}
            </Button>
          </figure>
        ))}
      </div>
    </div>
  </div>
  )
  );
}

export default SelectNeighbourhood;
