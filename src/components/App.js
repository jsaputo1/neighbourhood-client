import React, { useEffect, useState } from "react";
import "../styles.scss";
import axios from "axios";
import Nav from "./Nav/Nav";
import Events from "./Events/Events";
import Services from "./Services/Services";
import Alerts from "./Alerts/Alerts";
import MapPage from "./Map/MapPage";
import Messages from "./Messages/Messages";
import NewMessage from "./Messages/NewMessage";
import Account from "./Account/Account";
import EditUserInformation from "./Account/EditUserInformation";
import Home from "./Home/Home";
import Landing from "./Landing/Landing";
import Login from "./Landing/Login";
import Register from "./Landing/Register";
import SelectNeighbourhood from "./Landing/SelectNeighbourhood";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Imports custom hook that manages the state
import useApplicationData from "../hooks/useApplicationData";

function App() {
  //Gets the state from useApplicationData.js
  const { state, setUser, setReceiver, setEvent } = useApplicationData();
  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchCategoriesAndSubscriptions = async () => {
    const data = await axios.get("http://localhost:8001/categories");
    setCategories(data.data);
    const mata = await axios.get("http://localhost:8001/subscriptions");
    setSubscriptions(mata.data);
  };

  // const fetchSubscriptions = async () => {
  //   const data = await axios.get('http://localhost:8001/subscriptions');
  //   setSubscriptions(data.data)
  // };

  useEffect(() => {
    fetchCategoriesAndSubscriptions();
    // fetchSubscriptions();
  }, []);

  //That is going to be our main app, once we log in or sign in
  const Website = () => (

    <div>
      <Nav user={state.user} logout={setUser} />
      <Switch>
        <Route path="/home" exact>
          <Home
            user={state.user}
            receiver={state.receiver}
            receiverData={setReceiver}
            eventSelected={state.event}
            setEvent={setEvent}
          ></Home>
        </Route>
        <Route path="/events" exact>
          <Events
            user={state.user}
            receiver={state.receiver}
            receiverData={setReceiver}
            subscriptions={subscriptions}
            categories={categories}
            eventSelected={state.event}
            setEvent={setEvent}
          ></Events>
        </Route>
        <Route path="/services" exact>
          <Services
            user={state.user}
            receiver={state.receiver}
            receiverData={setReceiver}
            subscriptions={subscriptions}
            categories={categories}
          ></Services>
        </Route>
        <Route path="/alerts" exact>
          <Alerts
            user={state.user}
            receiver={state.receiver}
            receiverData={setReceiver}
            subscriptions={subscriptions}
            categories={categories}
          ></Alerts>
        </Route>
        <Route path="/map" exact>
          <MapPage
            user={state.user}
            receiver={state.receiver}
            receiverData={setReceiver}
            eventSelected={state.event}
            setEvent={setEvent}
          ></MapPage>
        </Route>
        <Route path="/messages" exact>
          <Messages user={state.user}></Messages>
        </Route>
        <Route path="/newMessage" exact>
          <NewMessage user={state.user} receiver={state.receiver}></NewMessage>
        </Route>
        <Route path="/account" exact>
          <Account
            updateSubscriptions={fetchCategoriesAndSubscriptions}
            updateUser={setUser}
            subscriptions={subscriptions}
            categories={categories}
            user={state.user}
          ></Account>
        </Route>
      </Switch>
    </div>
  );
  return (
    <Router>
      <Switch>
        {/* These are the path were we don't want to see the navbar */}
        <Route path="/" exact component={Landing} />
        <Route path="/login" exact>
          <Login login={setUser}></Login>
        </Route>
        <Route path="/register" exact>
          <Register register={setUser}></Register>
        </Route>
        <Route path="/selectNeighbourhood" exact>
          <SelectNeighbourhood
            user={state.user}
            register={setUser}
          ></SelectNeighbourhood>
        </Route>
        <Route path="/editUserInformation" exact>
          <EditUserInformation
            user={state.user}
            editUser={setUser}
          ></EditUserInformation>
        </Route>
        {/* These are the paths were we will see the navbar */}
        <Route component={Website} />
      </Switch>
    </Router>
  );
}

export default App;
