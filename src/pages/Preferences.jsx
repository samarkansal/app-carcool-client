import React, { useState } from "react";
import { Container, Tabs, Tab, Form, Button, Row, Col } from "react-bootstrap";

const Preferences = () => {
  const [key, setKey] = useState("basicInfo");

  return (
    <div className="bgimg-dash">
      <div className="dark-overlay">
        <Container className="home-container">
          <h1 className="cont-title">User Preferences</h1>
          <Tabs
            id="preferences-tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="basicInfo" title="Basic Info">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control type="text" placeholder="Contact Number" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" placeholder="Address" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="interests" title="Interests">
              <Form>
                <Row>
                  <Col md={6}>
                    <h3>Lifestyle</h3>
                    <div className="mb-3">
                      <Form.Check type="checkbox" label="Travel" />
                      <Form.Check type="checkbox" label="Music" />
                      <Form.Check type="checkbox" label="Sports" />
                      <Form.Check type="checkbox" label="Photography" />
                      <Form.Check type="checkbox" label="Tech & Gadgets" />
                    </div>
                  </Col>
                  <Col md={6}>
                    <h3>Outdoor Activities</h3>
                    <div className="mb-3">
                      <Form.Check type="checkbox" label="Hiking" />
                      <Form.Check type="checkbox" label="Camping" />
                      <Form.Check type="checkbox" label="Fishing" />
                      <Form.Check type="checkbox" label="Cycling" />
                      <Form.Check type="checkbox" label="Running" />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <h3>Entertainment</h3>
                    <div className="mb-3">
                      <Form.Check type="checkbox" label="Movies & Cinema" />
                      <Form.Check type="checkbox" label="Board Games" />
                      <Form.Check type="checkbox" label="Video Games" />
                      <Form.Check type="checkbox" label="Book Clubs" />
                      <Form.Check type="checkbox" label="Live Music" />
                    </div>
                  </Col>
                  <Col md={6}>
                    <h3>Food & Drink</h3>
                    <div className="mb-3">
                      <Form.Check type="checkbox" label="Coffee" />
                      <Form.Check type="checkbox" label="Wine Tasting" />
                      <Form.Check type="checkbox" label="Craft Beers" />
                      <Form.Check type="checkbox" label="Baking" />
                      <Form.Check type="checkbox" label="Cooking Classes" />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <h3>Professional & Networking</h3>
                    <div className="mb-3">
                      <Form.Check type="checkbox" label="Startups" />
                      <Form.Check
                        type="checkbox"
                        label="Coding & Programming"
                      />
                      <Form.Check type="checkbox" label="Design Thinking" />
                      <Form.Check type="checkbox" label="Digital Marketing" />
                      <Form.Check type="checkbox" label="Public Speaking" />
                    </div>
                  </Col>
                  {/* Placeholder for additional categories or empty space */}
                  <Col md={6}></Col>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginTop: "10px" }}
                >
                  Save Interests
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="carInfo" title="Car Info">
              <Form>
                <Form.Group className="mb-3" controlId="formCarMake">
                  <Form.Label>Make</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="BMW"
                    defaultValue="BMW"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarModel">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="3 Series"
                    defaultValue="3 Series"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="2020"
                    defaultValue={2020}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarColor">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Green"
                    defaultValue="Green"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarPlateNumber">
                  <Form.Label>Plate Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="EV6753"
                    defaultValue="EV6753"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Save Car Info
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default Preferences;
