import React, { useState, useEffect } from "react";
import moment from 'moment';
import axios from "axios";
import { Redirect, Link } from "react-router-dom";


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Modal, Backdrop, Fade, } from "@material-ui/core";
import { Form } from "react-bootstrap";


// import styles from "./Material-kit-components/landingPage.js";
import "../../styles.scss";

//for Material UI
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  rootCard: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

moment().format();


function Account(props) {
  const classes = useStyles();

  const [neighbourhood, setNeighbourhood] = useState([]);
  const [editRedirect, setEditRedirect] = useState((false));
  const [open, setOpen] = useState(false);

  // const [state, setState] = React.useState({
  //   selectedAlert_Type: props.user.alert_types,
  // });

  const [nbOfNeighbours, setnbOfNeighbours] = useState(0);
  //Grab the neighbourhood id from the props
  const userNeighbourhoodId = props.user.neighbourhood_id;
  //get the neighbourhood object
  const findNeighbourhood = (id) => {
    axios.get("/neighbourhood").then((response) => {
      const neighbourhoods = response.data;
      const userNeighbourhood = neighbourhoods.find(
        (neighbourhood) => neighbourhood.id === id
      );
      setNeighbourhood(userNeighbourhood);
    });
  };
  const findNumberofNeighbours = (id) => {
    axios.get("/users/profile-info").then((response) => {
      const users = response.data;
      const usersinNeighbourhood = users.filter(
        (user) => user.neighbourhood_id === id
      );
      setnbOfNeighbours(usersinNeighbourhood.length);
    });
  };

  useEffect(() => {
    findNeighbourhood(userNeighbourhoodId);
    findNumberofNeighbours(userNeighbourhoodId);
  }, []);

  const [checked, setChecked] = useState({
    1: false, 2: false, 3: false, 4: false, 5: false,
    6: false, 7: false, 8: false, 9: false, 10: false,
    11: false, 12: false, 13: false, 14: false, 15: false,
    16: false, 17: false, 18: false, 19: false, 20: false,
    21: false,
  });

  const populateChecked = function () {
    const buttonsToCheck = props.subscriptions.filter((sub) => sub.user_id === props.user.id).map((sub) => sub.category_id)
    const generateCheckedState = function () {
      const obj = {
        1: false, 2: false, 3: false, 4: false, 5: false,
        6: false, 7: false, 8: false, 9: false, 10: false,
        11: false, 12: false, 13: false, 14: false, 15: false,
        16: false, 17: false, 18: false, 19: false, 20: false,
        21: false,
      }
      for (const sub of buttonsToCheck) {

        obj[sub] = true
      }
      return obj;
    }
    setChecked(generateCheckedState())
  }

  const handleClick = (e) => {
    const boxName = e.target.name
    setChecked({
      ...checked,
      [boxName]: !checked[boxName]
    });
  }

  // function getRandomInt(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  const fetchAccountInfo = async () => {
    const accountInfo = await axios.get('http://localhost:8001/account');
    const neighbourhoodInfo = accountInfo.data.filter(neighbourhood => neighbourhood.id === props.user.neighbourhood_id)[0]
    setNeighbourhood(neighbourhoodInfo);
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  useEffect(() => {
    populateChecked();
  }, [props.subscriptions]);

  // function changeAlert_Type(e) {
  //   setState({
  //     ...state,
  //     selectedAlert_Type: e.target.value,
  //   });
  // }


  // these functions handle the Modal REFACTORASFASD ASDASDFASDLFUASFIUHASdfJASPODFJA:OIDFJ"APWOKDAWASDFASDASDDSA
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    console.log("CLOSE")
    setOpen(false);
  };
  const handleCloseCancel = () => {
    console.log("CLOSE")
    populateChecked();
    setOpen(false);
  };

  const filterCategories = (filter) => {
    const filtered = props.categories.filter(category => category.category_type === filter)
    return (filtered)
  };

  const sortSubscriptions = function (subscriptions) {
    let createSubs = []
    for (const entry in subscriptions) {
      if (subscriptions[entry] === true) {
        createSubs.push(entry)
      }
    }
    return createSubs;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log("SUBMIT")
    updateSubscriptionPreferences({
      // alert_types: state.selectedAlert_Type,
      subscriptions: sortSubscriptions(checked),
      user_id: props.user.id
    });
  }

  const updateSubscriptionPreferences = async function (subscriptionData) {
    const newSubscriptions = subscriptionData.subscriptions
    const generateAxiosCalls = function () {
      console.log("NEWSIES", newSubscriptions)
      return Promise.all(newSubscriptions.map((categoryId) => {
        console.log("IN PROMISE", subscriptionData.user_id, categoryId)
        return axios.post("/subscriptions", { user_id: subscriptionData.user_id, category_id: categoryId })
      }
      ));
    };
    // SET TIMEOUT MIGHT FIX?! LIKE TWILIO!?
    await axios.post("/subscriptions/delete", { user_id: subscriptionData.user_id })
      .then(generateAxiosCalls())
      .then(setTimeout(() => props.updateSubscriptions()), 2000)
      .then(handleClose())
      .catch((err) => console.error("query error", err.stack))
    // .then(axios.post("/users/notifcation-settings", { alert_types: subscriptionData.alert_types, user_id: subscriptionData.user_id }))
    // .then((response) => {
    //   console.log("REPOND", response)
    // })
    // CAUSING PROXY ERRORS which either results in multiple subscriptions for the current user disappearing, or just ID 1 (Emergencies) being unsubscribed-from.
    // RETURNING REDIRECT BELOW MAKES THIS WORK AS INTENDED, AT THE COST OF CAUSING A RERENDER.
    // return (
    //   <Redirect to="/account" />
    // )
  };

  if (editRedirect) {
    return (
      <Redirect to="/editUserInformation" />);
  }

  return (
    <div>
      {/* <Parallax image={require(`../../assets/img/apartment1.jpg`)}> */}
      <div id="account-wrapper">
        {/* <div className="container-fluid gedf-wrapper"> */}
        <div id="account-spreader" className={classes.containerLogin}>
          {/* <Box user={props.user} /> */}
          <div id="account-center-column" className="col-md-4">
            <div className="card box">

              <div id="account-user-info-header" className="card-header">

                <div className="account-header-spreader">

                  <img
                    className="rounded-circle"
                    width="100"
                    src={props.user.profile_photo}
                    alt={`${props.user.first_name} ${props.user.last_name}`}
                  ></img>
                  <div className="account-user-name">
                    <div className="h5">{props.user.first_name} {props.user.last_name}</div>
                  </div>
                </div>

                <div className="account-header-spreader-2">

                  <div id="account-header-contact-info">
                    <div><b>phone number: </b><span className="text-muted">{props.user.phone_number}</span></div>
                    <div><b>email:</b> <span className="text-muted">{props.user.email}</span></div>
                  </div>

                  <div id="account-button-group">
                    <Button id="account-edit" size="small" className="account-buttons" onClick={() => setEditRedirect(true)} variant="contained" color="primary" type="button">
                      Edit Account
                        </Button>
                    <br></br>
                    <Button size="small" className="account-buttons" type="button" variant="contained" color="primary" onClick={handleOpen}>
                      Subscriptions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div id="account-bio" className="h6">
                  {props.user.bio}
                </div>
              </div>

              <ul className="list-group list-group-flush">
                <li id="account-neighbourhood" className="list-group-item">
                  <div id="account-single-neighbourhood">
                    <div className="h6 text-muted">Your neighbourhood</div>
                    <div className="h5">{neighbourhood.name}</div>
                  </div>
                  <div id="account-single-neighbours">
                    <div className="h6 text-muted">Total Neighbours</div>
                    <div className="h5">{nbOfNeighbours}</div>
                  </div>
                </li>
                {/* <li className="list-group-item">
                  <div className="h6 text-muted">Neighbours</div>
                  <div className="h6">{nbOfNeighbours}</div>
                </li> */}
                <li className="list-group-item">
                  <Link to="/map">
                    <img
                      width="100%"
                      src={neighbourhood.neighbourhood_photo}
                      alt=""
                      class="card-img-bottom"
                    ></img>
                  </Link>
                </li>
              </ul>


              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                // onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={open}>
                  <div id="account-subscriptions-subscriptions" className={classes.paper}>

                    <Grid container spacing={3}>

                      <Form id="account-subscriptions-form" onSubmit={onSubmitHandler}>
                        <Grid item xs={12}>
                          <h2 id="account-subscription-title">
                            Manage Subscriptions
                          </h2>
                          <p id="account-SMS-note"><small><i>To receive subscription-notifications, please ensure that your account is registered with a SMS-enabled phone number.</i></small></p>
                        </Grid>


                        <Grid item xs={12}>
                          <h5 className="account-subscriptions-category">Alerts</h5>
                          <div className="account-map-wrapper">
                            {filterCategories("Alerts").map((category) => (
                              <Form.Check inline
                                name={category.id}
                                onClick={handleClick}
                                key={category.id}
                                value={category.id}
                                label={category.name}
                                checked={checked[category.id]}
                                type="checkbox"
                                id={category.id} />
                            ))}
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <h5 className="account-subscriptions-category">Events</h5>
                          <div className="account-map-wrapper">
                            {filterCategories("Events").map((category) => (

                              <Form.Check inline
                                name={category.id}
                                onClick={handleClick}
                                key={category.id}
                                value={category.id}
                                label={category.name}
                                checked={checked[category.id]}
                                type="checkbox"
                                id={category.id} />

                            ))}
                          </div>
                        </Grid>

                        <Grid item xs={12}>
                          <h5 className="account-subscriptions-category">Services</h5>
                          <div className="account-map-wrapper">
                            {filterCategories("Services").map((category) => (

                              <Form.Check inline
                                name={category.id}
                                onClick={handleClick}
                                key={category.id}
                                value={category.id}
                                label={category.name}
                                checked={checked[category.id]}
                                type="checkbox"
                                id={category.id} />
                            ))}
                          </div>
                        </Grid>


                        {/* <p>Change Alert Type</p> */}

                        {/* <FormGroup controlId="serviceCategory">
                        <Form.Label>Select Alert Type</Form.Label>
                        <Form.Control
                          as="select"
                          value={state.selectedAlert_Type}
                          onChange={changeAlert_Type}
                        >
                          <option>Both</option>
                          <option>SMS</option>
                          <option>Email</option>
                          <option>None</option>
                          ))
                        </Form.Control>
                      </FormGroup> */}
                        <div id="account-subscriptions-buttons">
                          < Button
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            Post
                            </Button>

                          <Button
                            id="account-subscription-cancel-button"
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={handleCloseCancel}
                          >
                            Cancel
                            </Button>
                        </div>
                      </Form>
                    </Grid>
                  </div>
                </Fade>
              </Modal>

            </div>
          </div>
        </div>
      </div>
      {/* </div > */}
      {/* </Parallax> */}
    </div>
  );
}

export default Account;
