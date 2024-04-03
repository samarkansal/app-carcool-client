import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const SearchRidesTab = () => {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false by default
  const [error, setError] = useState(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    // Ensure Google Maps script is loaded
    if (!window.google) {
      console.error("Google Maps JavaScript API not loaded");
      return;
    }

    // Initialize autocomplete for both input fields
    const autocompleteFrom = new window.google.maps.places.Autocomplete(
      fromInputRef.current
    );
    const autocompleteTo = new window.google.maps.places.Autocomplete(
      toInputRef.current
    );

    // Optional: Handle place selection for each autocomplete field
    // autocompleteFrom.addListener("place_changed", () => {
    //   const place = autocompleteFrom.getPlace();
    //   console.log(place); // Do something with the selected place
    // });

    // autocompleteTo.addListener("place_changed", () => {
    //   const place = autocompleteTo.getPlace();
    //   console.log(place); // Do something with the selected place
    // });
  }, []);

  const fetchRides = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rides?page=1`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Something went wrong!");
      const data = await response.json();
      setRides(data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRides(); // Fetch rides when the form is submitted
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container>
      {/* Search Form */}
      <Box
        className="form-cont"
        component="form"
        onSubmit={handleSubmit}
        sx={{ marginBottom: 4 }}
      >
        <Form.Group controlId="from">
          <Form.Label>From</Form.Label>
          <Form.Control
            ref={fromInputRef}
            type="text"
            placeholder="Enter starting location"
          />
        </Form.Group>

        <Form.Group controlId="to">
          <Form.Label>To</Form.Label>
          <Form.Control
            ref={toInputRef}
            type="text"
            placeholder="Enter destination"
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Search
        </Button>
      </Box>

      {/* Results Display */}
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {rides.map((ride) => (
          <Grid item xs={12} sm={6} md={4} key={ride._id}>
            <Nav.Link
              as={Link}
              to={`/ride/book/${ride._id}`}
              className="search-card"
            >
              <CardContent>
                <Typography
                  sx={{ fontWeight: 700 }}
                  variant="h5"
                  component="div"
                >
                  {ride.car.make} {ride.car.model}
                </Typography>
                <Typography sx={{ mb: 1.5, color: "white", fontWeight: 600 }}>
                  {ride.startPoint.name} to {ride.endPoint.name}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(ride.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Seats Available:{" "}
                  {ride.capacity.total - ride.capacity.occupied}
                </Typography>
                <Typography variant="body2">
                  Price per Seat: ${ride.priceSeat.toFixed(2)}
                </Typography>
              </CardContent>
            </Nav.Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchRidesTab;
