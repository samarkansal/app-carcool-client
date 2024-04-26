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
import { useAuth } from "../contexts/AuthContext";

const SearchRidesTab = () => {
  const [formValues, setFormValues] = useState({
    startPoint: { name: "", coordinates: [0, 0] },
    endPoint: { name: "", coordinates: [0, 0] },
    date: "",
  });
  const [rides, setRides] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("earliest");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const { currentUser } = useAuth();

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
        console.log("here");
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
  }, [fromInputRef, toInputRef]);

  useEffect(() => {
    const from = formValues.startPoint.coordinates;
    const to = formValues.endPoint.coordinates;
    const date = formValues.date;
    console.log(formValues);
    // Fetch rides only if there is a valid date and locations
    if (from.length > 0 && to.length > 0 && date) {
      fetchRides(from, to, date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortCriteria]);

  const fetchRides = async (from, to, date) => {
    setIsLoading(true);
    setError(null);
    const searchQuery = {
      startLocation: from,
      endLocation: to,
      date: date,
      sort: sortCriteria,
      page: currentPage, // Add page number to the query
    };
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rides/search`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(searchQuery),
      });
      if (!response.ok) throw new Error("Something went wrong!");
      const data = await response.json();
      console.log(data);
      setRides(data.result);
      setTotalPages(data.totalPages);
      setTotalRides(data.total);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPage !== 1) setCurrentPage(1);
    else {
      const from = formValues.startPoint.coordinates;
      const to = formValues.endPoint.coordinates;
      const date = formValues.date;
      fetchRides(from, to, date);
    }
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
          <Form.Control
            value={formValues.date}
            type="date"
            required
            onChange={(e) =>
              setFormValues({ ...formValues, date: e.target.value })
            }
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Search
        </Button>
      </Box>
      {rides.length > 0 ? (
        <div>
          {" "}
          {/* Results Display */}
          <div className="search-head">
            <Typography variant="h4" gutterBottom>
              Search Results
            </Typography>
            <Form.Group controlId="sort">
              <Form.Label>Sort By</Form.Label>
              <Form.Control
                as="select"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                required
              >
                <option value="earliest">Earliest Departure</option>
                <option value="vibe">Vibe Score</option>
                <option value="lowestPrice">Lowest Price</option>
              </Form.Control>
            </Form.Group>
          </div>
          <Typography variant="h6" gutterBottom>
            {totalRides} rides available
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
                      sx={{ fontWeight: 700, mb: 1 }}
                      variant="h5"
                      component="div"
                    >
                      {ride.car.make} {ride.car.model}
                    </Typography>
                    <Typography
                      sx={{ mb: 1.5, color: "white", fontWeight: 400 }}
                    >
                      {ride.startPoint.name} to {ride.endPoint.name}
                    </Typography>
                    <div className="card-col-cont">
                      <Typography variant="body" sx={{ color: "lightblue" }}>
                        <i className="far fa-clock"></i>{" "}
                        {new Date(ride.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Typography>
                      {/* <Typography variant="body2">
                      Seats Available:{" "}
                      {ride.capacity.total - ride.capacity.occupied}
                    </Typography> */}
                      <Typography variant="body" sx={{ color: "lightgreen" }}>
                        <i className="far fa-money-bill-alt"></i> $
                        {ride.priceSeat.toFixed(2)}
                      </Typography>
                    </div>
                    <Typography variant="body1" sx={{ fontWeight: "600" }}>
                      <i className="far fa-user"></i> {ride.userName}
                    </Typography>
                    <Typography variant="body" sx={{ color: "coral" }}>
                      <i className="fas fa-glass-cheers"></i> Vibe Score:{" "}
                      {ride.vibeScore} %
                    </Typography>
                  </CardContent>
                </Nav.Link>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ margin: "0 10px", lineHeight: "2.5rem" }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((current) => current + 1)}
            >
              Next
            </Button>
          </Box>
        </div>
      ) : (
        <h1>No Rides</h1>
      )}
    </Container>
  );
};

export default SearchRidesTab;
