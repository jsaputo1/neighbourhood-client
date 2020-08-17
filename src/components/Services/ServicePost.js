import React from "react";
import "../../styles.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

import {
    Button,
    Modal,
    Backdrop,
    Fade,
} from "@material-ui/core";
import { Form } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

function ServicePost(props) {
    const classes = useStyles();

    const setReceiver = function (data) {
        props.setReceiver(data);
    };

    const receiverObject = {
        first_name: props.user_first_name,
        last_name: props.user_last_name,
        user_id: props.user_id,
    };
    return (
        <div className="box">
            <div className="card">
                <div className="card-header">
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
                            <div className="service-offer-request">
                                {props.requestOrOffer}
                            </div>
                        </div>

                        <div id="SA-post-message-or-new">

                            {props.current_user_id === props.user_id ?

                                <div>
                                    <Button
                                        id="service-post-delete-button"
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        startIcon={<DeleteIcon />}
                                        onClick={props.handleOpenDelete}>
                                        DELETE Service
</Button>
                                    <Modal
                                        aria-labelledby="Moo"
                                        aria-describedby="Moo"
                                        className={props.modalClass}
                                        open={props.openDelete}
                                        onClose={props.handleCloseDelete}
                                        closeAfterTransition
                                        BackdropComponent={Backdrop}
                                        BackdropProps={{
                                            timeout: 500,
                                        }}
                                    >
                                        <Fade in={props.openDelete}>
                                            <div className={props.paperClass}>
                                                <h2 id="transition-modal-title">Are you sure you would like to delete this Service?</h2>
                                                <Form data-message={props.id} onSubmit={props.deleteSubmitHandler}>

                                                    <Button variant="contained" color="secondary" type="submit">
                                                        Confirm
</Button>
                                                    <Button onClick={props.handleCloseDelete} variant="contained" color="primary" type="button">
                                                        Cancel
</Button>
                                                </Form>
                                            </div>
                                        </Fade>
                                    </Modal>
                                </div>
                                :
                                <Link id="SA-post-message" className="message-icon" to={{ pathname: "/newmessage" }}>
                                    <i
                                        className="fa fa-comment-o fa-2x"
                                        aria-hidden="true"
                                        onClick={() => setReceiver(receiverObject)}
                                    ></i>
                                </Link>
                            }

                        </div>





                    </div>
                </div>
            </div>
            <div className="card-body">
                <ul className="list-group list-group-flush">
                    <li id="SA-post-title" className="list-group-item">
                        <h3 className="card-title">{props.post_title}</h3>
                    </li>

                    <li className="list-group-item">
                        <img className="post-photo" src={props.post_photo} alt=""></img>
                    </li>

                    <li className="list-group-item">
                        <p className="card-text">{props.post_description}</p>
                    </li>
                </ul>

            </div>
        </div>
    );
}

export default ServicePost;
