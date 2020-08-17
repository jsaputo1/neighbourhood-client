import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Calendar from "./Calendar";
import "../../styles.scss";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  Modal,
  Backdrop,
  Fade,
  FormGroup,
} from "@material-ui/core";
// React Bootstrap
import { Form } from "react-bootstrap";
//@material-ui-pickers for date and time
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

//Utility needed to get the date out of the form fields
import DateFnsUtils from "@date-io/date-fns";

// core components

// import styles from "./Material-kit-components/landingPage.js";
import "../../styles.scss";

import filterByNeighbourhood from "../Helpers/filterByNeighbourhood";

//for Material UI
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    marginTop: 2,
  },
}));

moment().format();

function Events(props) {
  const classes = useStyles();

  const fetchEvents = async () => {
    const events = await axios.get("http://localhost:8001/events");
    setEvents(filterByNeighbourhood(events.data, props.user.neighbourhood_id));
  };

  const filterAndSetCategories = (filter) => {
    const filtered = props.categories.filter(
      (category) => category.category_type === filter
    );
    setCategories(filtered);
  };

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);
  const [state, setState] = useState({
    search: "",
    selectedCategory: "",
    selectedDate: new Date(),
  });

  const fetchFilteredCategories = async (filter) => {
    const data = await axios.get("http://localhost:8001/categories");
    const filtered = data.data.filter(
      (category) => category.category_type === filter
    );
    setCategories(filtered);
  };

  useEffect(() => {
    fetchEvents();
    filterAndSetCategories("Events");
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const dateChange = (e) => {
    setState({
      ...state,
      selectedDate: e,
    });
  };

  // these functions handle the Modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const handleOpenDelete = () => {
  //   setOpenDelete(true)
  // };

  // const handleCloseDelete = () => {
  //   setOpenDelete(false)
  // };

  const fetchFilteredSubscriptions = async (postCategory_id) => {
    const data = await axios.get("http://localhost:8001/subscriptions");
    const filtered = data.data.filter(
      (subscription) => subscription.category_id === parseInt(postCategory_id)
    );
    const subscriber_ids = filtered.map((entry) => (entry = entry.user_id));
    const phoneData = await axios.get(
      "http://localhost:8001/users/phone-numbers"
    );
    const phoneFiltered = phoneData.data
      .filter(
        (user) =>
          subscriber_ids.includes(user.id) &&
          user.neighbourhood_id === props.user.neighbourhood_id
      )
      .map((entry) => `+${entry.phone_number}`);
    return phoneFiltered;
  };

  const sendSubscriptionSMS = async function (postCategory_id, title) {
    let categoryName = "";
    for (const category of categories) {
      if (category.id === parseInt(postCategory_id)) {
        categoryName = category.name;
      }
    }
    const phoneNumbers = await fetchFilteredSubscriptions(postCategory_id);
    axios.post("/twilio", { phoneNumbers, categoryName, title });
  };
  //Functions to format the date coming from the imput fields in the form
  const formatDate = (x) => {
    let Y = new Date(x);
    let date = JSON.stringify(Y);
    date = date.slice(1, 11);
    // let [date, month, year] = x.toLocaleDateString().split("/");
    // return `${year}-${month}-${date}`;
    return date;
  };
  const formatTime = (x) => {
    let [hour, minute, second] = x.toLocaleTimeString().slice(0, 7).split(":");
    return `${hour}:${minute}:${second}0`;
  };

  //Post request to save the event in the database
  const registerEvent = function (registrationData) {
    axios.post("/events", registrationData).then((response) => {
      setEvents(
        filterByNeighbourhood(response.data, props.user.neighbourhood_id)
      );
    });
  };

  const onSubmitHandler = function (event) {
    event.preventDefault();
    const streetNumber = event.target.elements["streetNumber"].value;
    const streetName = event.target.elements["streetName"].value;
    const city = event.target.elements["city"].value;
    const title = event.target.elements["eventTitle"].value;
    const description = event.target.elements["eventDescription"].value;
    const event_photo = event.target.elements["eventPhoto"].value;
    //Gets the coordinates for the address entered by the user and save info to database
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${streetNumber}+${streetName}+${city}+CA&key=${process.env.REACT_APP_GEOCODING_KEY}`
      )
      .then((response) => {
        const coordinates = response.data.results[0].geometry.location;
        const formattedCoordinates = `(${coordinates.lat}, ${coordinates.lng})`;
        registerEvent({
          user_id: props.user.id,
          category_id: state.selectedCategory,
          neighbourhood_id: props.user.neighbourhood_id,
          title: title,
          coordinates: formattedCoordinates,
          description: description,
          event_photo: event_photo,
          event_start: formatDate(state.selectedDate),
          event_time: formatTime(state.selectedDate),
        });
        sendSubscriptionSMS(state.selectedCategory, title);
        handleClose();
      });
  };

  return (
    <div className="main">
      <div className="menu">
        <FormControl id="event-filter-by-category" variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="outlined-age-native-simple" id="z-index-zero">
            Filter By Category
          </InputLabel>
          <Select
            native
            value={state.search}
            onChange={handleChange}
            label="search"
            inputProps={{
              name: "search",
              id: "outlined-age-native-simple",
            }}
          >
            <option aria-label="None" value="" />
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="modal">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Form onSubmit={onSubmitHandler} className="form-contenant">
              <h2 id="transition-modal-title">Post New Event</h2>
              <div className="event-form">
                <div className="first-section">
                  <Form.Group controlId="eventTitle">
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control type="title" placeholder="Title" />
                  </Form.Group>
                  <FormGroup controlId="serviceCategory">
                    <Form.Label>Select Category</Form.Label>
                    <Form.Control
                      as="select"
                      value={state.selectedCategory}
                      onChange={handleChange}
                      name="selectedCategory"
                    >
                      <option></option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Control>
                  </FormGroup>

                  <Form.Group controlId="eventDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="description"
                      placeholder="Description"
                      as="textarea"
                      rows="3"
                    />
                  </Form.Group>

                  <Form.Group controlId="eventPhoto">
                    <Form.Label>Photo (URL or blank)</Form.Label>
                    <Form.Control type="url" />
                  </Form.Group>
                </div>
                <div className="second-section">
                  <FormGroup controlId="dateAndTime" className="date">
                    <Form.Label>Date and time</Form.Label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        value={state.selectedDate}
                        onChange={dateChange}
                      />
                      <TimePicker
                        value={state.selectedDate}
                        onChange={dateChange}
                      />
                    </MuiPickersUtilsProvider>
                  </FormGroup>

                  <Form.Group controlId="streetNumber">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="streetNumber"
                      placeholder="Street number"
                    />
                  </Form.Group>

                  <Form.Group controlId="streetName">
                    <Form.Control type="streetName" placeholder="Street name" />
                  </Form.Group>

                  <Form.Group controlId="city">
                    <Form.Control type="city" placeholder="City" />
                  </Form.Group>
                </div>
              </div>
              <Button variant="contained" color="primary" type="submit">
                Post
              </Button>
            </Form>
          </Fade>
        </Modal>
      </div>
      <div className="calender">
        <Calendar
          user={props.user}
          events={events}
          search={state.search}
          categories={categories}
          handleOpen={handleOpen}
          receiver={props.receiver}
          setReceiver={props.receiverData}
          eventSelected={props.eventSelected}
          setEvent={props.setEvent}
        />
      </div>
    </div>
  );
}

export default Events;
