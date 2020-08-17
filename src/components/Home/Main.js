import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import AlertsCarousel from "./AlertsCarousel";

function Main(props) {
  //Grabs the neighbourhood id from the props
  const userNeighbourhoodId = props.user.neighbourhood_id;

  const [events, setEvents] = useState([]);

  //Gets all the events in the neighbourhood
  const getEventsForNeighbourhood = (id) => {
    axios.get("/events").then((response) => {
      const events = response.data;
      const eventsInNeighbourhood = events.filter(
        (event) => event.neighbourhood_id === id
      );
      setEvents(eventsInNeighbourhood.slice(0, 6));
    });
  };

  useEffect(() => {
    getEventsForNeighbourhood(userNeighbourhoodId);
  }, []);
  return (
    <div className="col-md-6 gedf-main">
      <div className="upcoming-events">
        <div className="card gedf-card box">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h2 id="home-header">Upcoming Events in your Neighbourhood</h2>
            </div>
          </div>
        </div>

        <div></div>
        {events.map(
          (event) =>
            new Date(event.event_start) >= new Date() && (
              <Post
                key={event.id}
                user={props.user}
                user_photo={event.profile_photo}
                user_first_name={event.first_name}
                user_last_name={event.last_name}
                time_created={event.time_created}
                coordinates={event.coordinates}
                post_photo={event.event_photo}
                post_description={event.description}
                post_title={event.title}
                event_time={event.event_time}
                event_start={event.event_start}
                event_date={`${event.event_start.slice(0, 10)}T${
                  event.event_time
                  }.000Z`}
                receiver={props.receiver}
                setReceiver={props.setReceiver}
                user_id={event.user_id}
                eventSelected={props.eventSelected}
                setEvent={props.setEvent}
              />
            )
        )}
      </div>
    </div>
  );
}
export default Main;
