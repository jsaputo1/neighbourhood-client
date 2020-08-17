import React, { useState } from "react";
import "../../styles.scss";
import { Form } from "react-bootstrap";
import axios from 'axios';

function Conversation(props) {
  const onSubmitHandler = function (event) {
    event.preventDefault();
    const message = event.target.elements['message'].value;
    sendReply({
      message,
      receiver_id: props.receiver_id,
      conversation_id: props.conversation_id
    });
    props.conversations(message);
  };

  const sendReply = function (messageData) {
    axios.post("/messages/reply", messageData)
      .then(response => {
        props.conversations(response.data);
      });
  };

  const [userFirstName, setUserFirstName] = useState([]);
  const getUserInfo = function (userID) {
    axios.get(`/messages/userinfo?id=${userID}`)
      .then(
        (response) => {
          setUserFirstName(response.data.first_name + " " + response.data.last_name);
        }
      );
  };

  const [userPhoto, setUserPhoto] = useState([]);
  const getUserPhoto = function (userID) {
    axios.get(`/messages/userinfo?id=${userID}`)
      .then(
        (response) => {
          setUserPhoto(response.data.profile_photo);
        }
      );
  };

  return <div className="conversation">
    <figure>
      <div class="user-information">
        {getUserPhoto(props.receiver_id)}<img src={userPhoto} alt="profile picture" />
        <h2 className="conversation-header">{getUserInfo(props.receiver_id)} {userFirstName} </h2>
      </div>
      {props.children}
      <Form className="message-input" onSubmit={onSubmitHandler}>
        <Form.Group controlId="message">
          <Form.Control type="message" placeholder="Enter message" className="autosize" />
        </Form.Group>
        <button>Send</button>
      </Form>
    </figure>

  </div>;
}

export default Conversation;