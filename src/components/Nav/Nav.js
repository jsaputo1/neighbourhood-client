import React, { useState } from "react";
import "../../styles.scss";
import { Link, NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from "axios";

function Nav(props) {

  const [landingRedirect, setlandingRedirect] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const toggleUserDropdown = () => setUserDropdownOpen(prevState => !prevState);
  const [messageNotification, setMessageNotification] = useState(true);

  const removeNotification = () => {
    setMessageNotification(false);
  };

  const logout = () => {
    axios.post("/users/logout").then((response) => {
      setlandingRedirect(true);
      props.logout({});
    });
  };

  if (landingRedirect) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="nav-bar">
      <div className="left-side-nav">
        <NavLink to="/home">
          <img src="https://i.imgur.com/j6IJGS2.png" alt="logo" />
        </NavLink>
        <div className="menu-dropdown">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle>
              Menu <i className="fa fa-chevron-down"></i>
            </DropdownToggle>
            <DropdownMenu>
              <NavLink to="/home">
                <DropdownItem>Home</DropdownItem>
              </NavLink>
              <NavLink to="/events">
                <DropdownItem>Events</DropdownItem>
              </NavLink>
              <NavLink to="/services">
                <DropdownItem>Services</DropdownItem>
              </NavLink>
              <NavLink to="/alerts">
                <DropdownItem>Alerts</DropdownItem>
              </NavLink>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="menu-dropdown-mobile">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle>
              <i className="fa fa-bars"></i>
            </DropdownToggle>
            <DropdownMenu>
              <NavLink to="/home">
                <DropdownItem>Home</DropdownItem>
              </NavLink>
              <NavLink to="/events">
                <DropdownItem>Events</DropdownItem>
              </NavLink>
              <NavLink to="/services">
                <DropdownItem>Services</DropdownItem>
              </NavLink>
              <NavLink to="/alerts">
                <DropdownItem>Alerts</DropdownItem>
              </NavLink>
              <NavLink to="/map">
                <DropdownItem>Map</DropdownItem>
              </NavLink>
              <NavLink to="/account">
                <DropdownItem>Profile</DropdownItem>
              </NavLink>
              <DropdownItem><span onClick={logout}>Logout</span></DropdownItem>
            </DropdownMenu>

          </Dropdown>
        </div>
      </div>
      <div className="middle-nav">
        <NavLink to="/home">
          <img src="/images/banner-black.png" alt="banner-logo" />
        </NavLink>
      </div>
      <div className="right-side-nav">
        {props.user === undefined ? (
          <Link className="link-style" to="/Login">
            Login
          </Link>
        ) : (
            <div className="right-side-nav">
              <Link className="link-style" to="/Map">
                <i className="fa fa-map"></i>
              </Link>
              <div className="message-icon">
                {messageNotification === true ? (
                  <div className="message-icon-text">
                    <i className="fa fa-exclamation"></i>
                  </div>
                ) : (
                    <div className="no-message-icon-text">
                    </div>
                  )}
                <Link className="link-style" to="/Messages">
                  <i className="fa fa-comment-o fa-2x" aria-hidden="true" onClick={removeNotification}></i>
                </Link>
              </div>
              <div className="user-info-nav">
                <img src={props.user.profile_photo} alt="profile" />
                <h3>{props.user.first_name} {props.user.last_name}</h3>
              </div>
              <div className="user-dropdown">
                <Dropdown isOpen={userDropdownOpen} toggle={toggleUserDropdown} className="user-dropdown-toggle-show">
                  <DropdownToggle>
                    <i className="fa fa-chevron-down"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem header>
                      <figure className="user-dropdown-figure">
                        <img src={props.user.profile_photo} alt="profile" />
                        {props.user.first_name} {props.user.last_name}
                      </figure>
                      <DropdownItem divider />
                    </DropdownItem>
                    <NavLink to="/account">
                      <DropdownItem>Your Profile</DropdownItem>
                    </NavLink>
                    <DropdownItem><span onClick={logout}>Logout</span></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          )}
      </div>
    </div >
  );
};

export default Nav;


