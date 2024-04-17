import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  CardContent,
} from "@mui/material";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const SearchRidesTab = () => {
  const [formValues, setFormValues] = useState({
    startPoint: { name: "", coordinates: [0, 0] },
    endPoint: { name: "", coordinates: [0, 0] },
    date: "",
  });
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    function initAutocomplete(inputRef, fieldName) {
      if (!window.google) {
        console.error("Google Maps JavaScript API not loaded");
        return;
      }
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["geocode"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const coordinates = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];

        setFormValues((prevState) => ({
          ...prevState,
          [fieldName]: {
            ...prevState[fieldName],
            name: place.formatted_address,
            coordinates: coordinates,
          },
        }));
      });
    }

    initAutocomplete(fromInputRef, "startPoint");
    initAutocomplete(toInputRef, "endPoint");
  }, []);

  const fetchRides = async (from, to, date) => {
    console.log(formValues);
    setIsLoading(true);
    setError(null);
    const searchQuery = {
      startLocation: from,
      endLocation: to,
      date: date,
    };
    try {
      // Update the URL to include search parameters based on input values
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rides/search`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchQuery),
      });
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
    const from = formValues.startPoint.coordinates;
    const to = formValues.endPoint.coordinates;
    const date = dateInputRef.current.value;
    fetchRides(from, to, date);
  };

  const refresh = () => {
    const from = formValues.startPoint.coordinates;
    const to = formValues.endPoint.coordinates;
    fetchRides(from, to, "2024-04-25");
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
        <button onClick={refresh}>Refresh</button>
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
          <Form.Label>
            From <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            ref={fromInputRef}
            type="text"
            placeholder="Enter starting location"
            required
          />
        </Form.Group>

        <Form.Group controlId="to">
          <Form.Label>
            To <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            ref={toInputRef}
            type="text"
            placeholder="Enter destination"
            required
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>
            Date <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control ref={dateInputRef} type="date" required />
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
                <Typography
                  sx={{ mb: 1.5, color: "text.primary", fontWeight: 600 }}
                >
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
