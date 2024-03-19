import React, { useState } from "react";
import SearchRidesTab from "../components/SearchRide";
import CreateRideTab from "../components/CreateRide";
import UpcomingRides from "../components/UpcomingRides";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Tabs,
  Tab,
} from "react-bootstrap";

const Home = () => {
  const [key, setKey] = useState("search");

  return (
    <div className="bgimg-dash">
      {/* <section className="bg-img-login"> */}
      {/* <div className="dark-overlay"></div> */}
      {/* </section> */}
      <div className="dark-overlay">
        <Container className="home-container">
          <Tabs
            id="controlled-tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="search" title="Search Ride">
              <SearchRidesTab />
            </Tab>

            <Tab eventKey="offer" title="Offer Ride">
              <CreateRideTab />
            </Tab>

            <Tab eventKey="upcoming" title="Upcoming Rides">
              {/* <h2>Upcoming Rides</h2> */}
              <UpcomingRides />
              {/* <Card className="mt-3 search-card">
                <Card.Body>
                  <Card.Title>Ride 1</Card.Title>
                  <Card.Text>Details of Ride 1</Card.Text>
                </Card.Body>
              </Card>

              <Card className="mt-3 search-card">
                <Card.Body>
                  <Card.Title>Ride 2</Card.Title>
                  <Card.Text>Details of Ride 2</Card.Text>
                </Card.Body>
              </Card> */}
            </Tab>

            {/* Consider adding more tabs for Profile, Settings, etc. */}
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default Home;
