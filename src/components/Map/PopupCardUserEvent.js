import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Form } from "react-bootstrap";
import moment from "moment";
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

export default function PopupCardAlert(props) {
  const classes = useStyles();


  const deleteSubmitHandler = function (event) {
    event.preventDefault();
    deleteEvent({
      user_id: props.user_id,
      title: props.post_title,
    });
    props.handleClose();
  };

  const deleteEvent = async function (registrationData) {
    await axios.delete("/events/delete", { data: registrationData })
      .then((response) => {
        const x = props.events.filter((event) => event.id !== response.data[0].id)
        props.setEvents(x);
      });
  };

  return (
    <Card className={classes.root}>
      {props.time_created && (
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
      {props.post_title && (
        <Typography variant="body1" color="textPrimary" component="p">
          {props.post_title}
        </Typography>
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
        <br />
        <Typography variant="body1" color="textPrimary" component="p">
          Would you like to delete this event?
        </Typography>
        <Form
          className="popup-buttons"
          data-message={props.event_id}
          onSubmit={deleteSubmitHandler}
        >
          <div className="popup-buttons">
            <button type="submit" className="btn btn-danger">
              CONFIRM
            </button>
            <Button onClick={props.handleClose} variant="contained" color="primary" type="button">
              Cancel
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
