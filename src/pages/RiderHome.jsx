import React, { useState } from "react";
import SearchRidesTab from "../components/SearchRide";
import UserBookings from "../components/UserBookings";
import { Container, Tabs, Tab } from "react-bootstrap";

const RiderHome = () => {
  const [key, setKey] = useState("search");

  return (
    <div className="bgimg-dash">
      <Container className="home-container">
        <Tabs
          id="controlled-tab-rider"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="search" title="Search Ride">
            <SearchRidesTab />
          </Tab>
          <Tab eventKey="bookings" title="Your Bookings">
            <UserBookings />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default RiderHome;
