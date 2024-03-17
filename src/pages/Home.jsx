import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Dropdown,
} from "react-bootstrap";

const Home = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Container>
          <Row className="mt-5">
            <Col>
              <h1>Search Ride</h1>
              <Form>
                <Form.Group controlId="from">
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter starting location"
                  />
                </Form.Group>

                <Form.Group controlId="to">
                  <Form.Label>To</Form.Label>
                  <Form.Control type="text" placeholder="Enter destination" />
                </Form.Group>

                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <h2>Upcoming Rides</h2>
              <Card>
                <Card.Body>
                  <Card.Title>Ride 1</Card.Title>
                  <Card.Text>Details of Ride 1</Card.Text>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Body>
                  <Card.Title>Ride 2</Card.Title>
                  <Card.Text>Details of Ride 2</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
