import React from "react";
import "../../styles.scss";
import moment from "moment";
import { Link } from "react-router-dom";

function Post(props) {
  const setReceiver = function (data) {
    props.setReceiver(data);
  };

  const receiverObject = {
    first_name: props.user_first_name,
    last_name: props.user_last_name,
    user_id: props.user_id,
  };

  const setEvent = function (data) {
    props.setEvent(data);
  };

  const eventObject = {
    user: props.user,
    user_photo: props.user_photo,
    user_first_name: props.user_first_name,
    user_last_name: props.user_last_name,
    time_created: props.time_created,
    coordinates: props.coordinates,
    event_photo: props.post_photo,
    description: props.post_description,
    title: props.post_title,
    event_time: props.event_time,
    event_start: props.event_start,
    event_date: props.event_date,
    receiver: props.receiver,
    setReceiver: props.setReceiver,
    user_id: props.user_id,
  };

  return (
    <div className="box">
      <div className="card gedf-card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="mr-2">
                <img
                  className="rounded-circle"
                  width="45"
                  src={props.user_photo}
                  alt=""
                ></img>
              </div>
              <div className="ml-2">
                <div className="h5 m-0">
                  {props.user_first_name} {props.user_last_name}
                </div>
                <div className="h7 text-muted">
                  {" " + moment(props.time_created).fromNow()}
                </div>
              </div>
            </div>
            <div className="post-icons">
              <Link className="message-icon fa-2x" to={{ pathname: "/map" }}>
                <i
                  class="fa fa-map-marker"
                  aria-hidden="true"
                  onClick={() => setEvent(eventObject)}
                ></i>
              </Link>
              {props.user.id !== props.user_id && (
                <Link className="message-icon" to={{ pathname: "/newmessage" }}>
                  <i
                    class="fa fa-comment-o fa-2x"
                    aria-hidden="true"
                    onClick={() => setReceiver(receiverObject)}
                  ></i>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="text-muted h7 mb-2 event-date">
            {" "}
            <i className="fa fa-clock-o fa-2x"></i>
            {}
            {" " + moment(props.event_date).calendar()}
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h5 className="card-title">{props.post_title}</h5>
            </li>
            <li className="list-group-item">
              <img
                className="eventpost-photo"
                src={props.post_photo}
                alt=""
              ></img>
            </li>
            <li className="list-group-item">
              <p className="card-text">{props.post_description}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Post;
