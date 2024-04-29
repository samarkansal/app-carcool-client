import React, { useState } from "react";
import CreateRideTab from "../components/CreateRide";
import UpcomingRides from "../components/UpcomingRides";
import { Container, Tabs, Tab } from "react-bootstrap";

const DriverHome = () => {
  const [key, setKey] = useState("offer");

  return (
    <div className="bgimg-driver">
      <div className="dark-overlay-driver">
        <Container className="home-container">
          <Tabs
            id="controlled-tab-driver"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="offer" title="Offer Ride">
              <CreateRideTab />
            </Tab>
            <Tab eventKey="upcoming" title="Upcoming Trips">
              <UpcomingRides />
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default DriverHome;
