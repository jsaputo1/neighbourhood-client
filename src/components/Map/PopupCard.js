import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { Link } from "react-router-dom";

import "../../styles.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    padding: 10,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

export default function PopupCard(props) {
  const classes = useStyles();

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
    <Card className={classes.root}>
      {props.time_created && props.user.id !== props.user_id && !props.isOnMap && (
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              alt=""
              src={props.user_photo}
              className={classes.large}
            />
          }
          action={
            <div>
              <Link className="message-icon fa-2x" to={{ pathname: "/map" }}>
                <i
                  class="fa fa-map-marker"
                  aria-hidden="true"
                  onClick={() => setEvent(eventObject)}
                ></i>
              </Link>
              <Link className="message-icon" to={{ pathname: "/newmessage" }}>
                <i
                  class="fa fa-comment-o fa-2x"
                  aria-hidden="true"
                  onClick={() => setReceiver(receiverObject)}
                ></i>
              </Link>
            </div>
          }
          title={`${props.user_first_name} ${props.user_last_name}`}
          subheader={`Posted ${moment(props.time_created).fromNow()}`}
        />
      )}
      {props.time_created && props.user.id !== props.user_id && props.isOnMap && (
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              alt=""
              src={props.user_photo}
              className={classes.large}
            />
          }
          action={
            <div>
              <Link className="message-icon" to={{ pathname: "/newmessage" }}>
                <i
                  class="fa fa-comment-o fa-2x"
                  aria-hidden="true"
                  onClick={() => setReceiver(receiverObject)}
                ></i>
              </Link>
            </div>
          }
          title={`${props.user_first_name} ${props.user_last_name}`}
          subheader={`Posted ${moment(props.time_created).fromNow()}`}
        />
      )}
      {props.time_created && props.user.id === props.user_id && (
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              alt=""
              src={props.user_photo}
              className={classes.large}
            />
          }
          title={`${props.user_first_name} ${props.user_last_name}`}
          subheader={`Posted ${moment(props.time_created).fromNow()}`}
        />
      )}
      {props.member_since && (
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              alt=""
              src={props.user_photo}
              className={classes.large}
            />
          }
          action={
            <Link className="message-icon" to={{ pathname: "/newmessage" }}>
              <i
                class="fa fa-comment-o fa-2x"
                aria-hidden="true"
                onClick={() => setReceiver(receiverObject)}
              ></i>
            </Link>
          }
          title={`${props.user_first_name} ${props.user_last_name}`}
          subheader={`Member since ${moment(props.member_since).format("LL")}`}
        />
      )}{" "}
      {props.post_title && (
        <Typography variant="body1" color="textPrimary" component="p">
          {props.post_title}
        </Typography>
      )}
      {props.event_start && props.event_time && (
        <div className="text-muted h7 mb-2">
          {" "}
          <i className="fa fa-clock-o"> </i>
          {"  " +
            moment(
              `${props.event_start.slice(0, 10)}T${props.event_time}.000Z`
            ).calendar()}
        </div>
      )}
      {props.post_photo && (
        <CardMedia
          className={classes.media}
          image={`${props.post_photo}`}
          title="Photo"
        />
      )}
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          {props.post_description}
        </Typography>
      </CardContent>
    </Card>
  );
}
