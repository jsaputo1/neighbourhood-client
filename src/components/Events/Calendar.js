import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import PopupCard from "../Map/PopupCard";
import PopupCardUserEvent from "../Map/PopupCardUserEvent";
import filterByCategory from "../Helpers/filterByCategory";
import { Modal, Backdrop, Fade } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../../styles.scss";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Calendar(props) {
  const classes = useStyles();
  //Grab the neighbourhood id from the props
  const userNeighbourhoodId = props.user.neighbourhood_id;
  //Manages the state of the events
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventUser, setSelectedEventUser] = useState(null);

  //Gets all the events in the neighbourhood
  const getFiltredEventsForNeighbourhood = (id) => {
    axios.get("/events").then((response) => {
      const events = response.data;
      const eventsInNeighbourhood = events.filter(
        (event) => event.neighbourhood_id === id
      );
      const filtredEvents = filterByCategory(
        eventsInNeighbourhood,
        props.search,
        props.categories
      );
      const formatedEvents = filtredEvents.map((event) => {
        let formattedEvent = Object.assign({}, event);
        formattedEvent.start = `${event.event_start.slice(0, 10)}T${
          event.event_time
        }`;
        switch (formattedEvent.category_id) {
          case 12:
            formattedEvent.color = "#6fb1c7";
            break;
          case 13:
            formattedEvent.color = "#ebba34";
            break;
          case 14:
            formattedEvent.color = "#9bc76f";
            break;
          case 15:
            formattedEvent.color = "#d18080";
            break;
          case 16:
            formattedEvent.color = "#b68bc4";
            break;
          case 18:
            formattedEvent.color = "#c79893";
            break;
          case 19:
            formattedEvent.color = "#c793b7";
            break;
          case 20:
            formattedEvent.color = "#93c7ac";
            break;
          case 21:
            formattedEvent.color = "#c7b993";
            break;
        }

        return formattedEvent;
      });

      setEvents(formatedEvents);
    });
  };

  //Gets user info for selectedEvent
  const getUserForSelectedEvent = (id) => {
    axios.get("/users/profile-info").then((response) => {
      const users = response.data;
      const userForSelectedEvent = users.find((user) => user.id === id);
      setSelectedEventUser(userForSelectedEvent);
    });
  };

  useEffect(() => {
    getFiltredEventsForNeighbourhood(userNeighbourhoodId);
  }, [props.search, props.events]);

  useEffect(() => {
    if (selectedEvent) {
      getUserForSelectedEvent(selectedEvent.user_id);
    }
  }, [selectedEvent]);

  const handleOpen = (info) => {
    const title = info.event.title;
    const event_info = info.event.extendedProps;
    const event = {
      ...event_info,
      title: title,
    };
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="box">
      <div className="card" id="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin]}
          class="calendar-wrapper"
          initialView="dayGridMonth"
          height="80vh"
          themeSystem="standard"
          customButtons={{
            myCustomButton: {
              text: "Add Event",
              click: function () {
                {
                  props.handleOpen();
                }
              },
            },
          }}
          headerToolbar={{
            left: "myCustomButton",
            center: "title",
            right: "today prev,next",
          }}
          events={events}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          eventDisplay="block"
          eventClick={handleOpen}
          // backgroundColor="#add3e0"
          // borderColor="#add3e0"
          // eventColor="#6fb1c7"
        />
        <div>
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
              <div>
                {selectedEvent &&
                  selectedEventUser &&
                  (props.user.id !== selectedEvent.user_id ? (
                    <PopupCard
                      user={props.user}
                      user_photo={selectedEventUser.profile_photo}
                      user_first_name={selectedEventUser.first_name}
                      user_last_name={selectedEventUser.last_name}
                      time_created={selectedEvent.time_created}
                      coordinates={selectedEvent.coordinates}
                      post_photo={selectedEvent.event_photo}
                      post_description={selectedEvent.description}
                      post_title={selectedEvent.title}
                      event_time={selectedEvent.event_time}
                      event_start={selectedEvent.event_start}
                      event_date={`${selectedEvent.event_start.slice(0, 10)}T${
                        selectedEvent.event_time
                      }.000Z`}
                      receiver={props.receiver}
                      setReceiver={props.setReceiver}
                      user_id={selectedEvent.user_id}
                      eventSelected={props.eventSelected}
                      setEvent={props.setEvent}
                      isOnMap={false}
                    />
                  ) : (
                    <PopupCardUserEvent
                      user_photo={selectedEventUser.profile_photo}
                      user_first_name={selectedEventUser.first_name}
                      user_last_name={selectedEventUser.last_name}
                      time_created={selectedEvent.time_created}
                      post_photo={selectedEvent.event_photo}
                      post_description={selectedEvent.description}
                      post_title={selectedEvent.title}
                      event_time={selectedEvent.event_time}
                      event_start={selectedEvent.event_start}
                      receiver={props.receiver}
                      setReceiver={props.setReceiver}
                      user_id={selectedEvent.user_id}
                      event_id={selectedEvent.id}
                      handleClose={handleClose}
                      reloadEvents={getFiltredEventsForNeighbourhood}
                      events={events}
                      setEvents={setEvents}
                      eventSelected={props.eventSelected}
                      setEvent={props.setEvent}
                    />
                  ))}
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    </div>
  );
}
