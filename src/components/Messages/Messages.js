import React, { useState, useEffect } from "react";
import axios from "axios";
import Conversation from "./Conversation";
import moment from 'moment';
import "../../styles.scss";

function Messages(props) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;
    axios.get("/messages/userMessages")
      .then(
        (response) => {
          if (isMounted) setConversations(response.data);
        }
      );
    return () => { isMounted = false; };

  }, [messages]);

  let conversation = [];

  const determineReceiver = function (user_one, user_two) {
    let receiverID = [];
    if (user_one === props.user.id) {
      receiverID = user_two;
    } else if (user_two === props.user.id) {
      receiverID = user_one;
    } return receiverID;
  };

  for (let conversationID in conversations) {
    let messagesJSX = [];
    for (let message of conversations[conversationID]) {
      let messageContent = (
        <div key={message.time_sent} className={message.message_text === "New conversation started" ? "new-conversation" : " not-hidden"}>
          <div className={message.sender_id === props.user.id ? " sent" : " received"}>
            <h2 className={message.message_text.length < 1 ? " hidden" : " message-content"}>{message.message_text}</h2>
            <h2 className="timestamp">{moment(message.time_sent, "").fromNow()}</h2>
          </div>
        </div>
      );
      messagesJSX.push(messageContent);
    }

    conversation.push(
      <Conversation
        conversation_id={conversationID}
        receiver_id={determineReceiver(conversations[conversationID][0].user_one, conversations[conversationID][0].user_two)}
        setReceiver={props.receiverData}
        conversations={setMessages}
      >
        {messagesJSX}
      </Conversation>);
  }
  return < div className="messages-container" >
    {conversation}
  </div >;
}

export default Messages;