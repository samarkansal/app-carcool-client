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

const PAGE_SIZE = 10; // or whatever you use on the backend

const SearchRidesTab = () => {
  /*********************
   *  STATE & CONTEXT  *
   *********************/
  const [formValues, setFormValues] = useState({
    startPoint: { name: "", coordinates: [] },
    endPoint: { name: "", coordinates: [] },
    date: "",
  });

  const [rides, setRides] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("earliest");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRides, setTotalRides] = useState(0);

  const { currentUser } = useAuth();

  /*********************
   *  INPUT REFS       *
   *********************/
  const fromInputEl = useRef(null);
  const toInputEl = useRef(null);

  /******************************************
   *  ATTACH / RE‑ATTACH GOOGLE AUTOCOMPLETE *
   ******************************************/
  useEffect(() => {
    if (!fromInputEl.current || !window.google) return;

    const ac = new window.google.maps.places.Autocomplete(fromInputEl.current, {
      types: ["geocode"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.geometry) return;

      setFormValues((v) => ({
        ...v,
        startPoint: {
          name: place.formatted_address,
          coordinates: [
            place.geometry.location.lng(),
            place.geometry.location.lat(),
          ],
        },
      }));
    });

    // cleanup if React swaps the node or component unmounts
    return () => window.google.maps.event.clearInstanceListeners(ac);
  }, [fromInputEl.current]);

  useEffect(() => {
    if (!toInputEl.current || !window.google) return;

    const ac = new window.google.maps.places.Autocomplete(toInputEl.current, {
      types: ["geocode"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.geometry) return;

      setFormValues((v) => ({
        ...v,
        endPoint: {
          name: place.formatted_address,
          coordinates: [
            place.geometry.location.lng(),
            place.geometry.location.lat(),
          ],
        },
      }));
    });

    return () => window.google.maps.event.clearInstanceListeners(ac);
  }, [toInputEl.current]);

  /***************************
   *  FETCH RIDES ON CHANGE  *
   ***************************/
  useEffect(() => {
    const { startPoint, endPoint, date } = formValues;
    if (
      startPoint.coordinates.length === 2 &&
      endPoint.coordinates.length === 2 &&
      date
    ) {
      fetchRides(startPoint.coordinates, endPoint.coordinates, date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortCriteria]);

  /*******************
   *  API CALL       *
   *******************/
  const fetchRides = async (from, to, date) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await currentUser.getIdToken();
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rides/search`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startLocation: from,
          endLocation: to,
          date,
          sort: sortCriteria,
          page: currentPage,
        }),
      });

      if (!res.ok) throw new Error("Something went wrong!");
      const data = await res.json();

      setRides(data.result);
      setTotalPages(data.totalPages);
      setTotalRides(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /*******************
   *  FORM HANDLERS  *
   *******************/
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPage !== 1) setCurrentPage(1);
    else {
      const { startPoint, endPoint, date } = formValues;
      fetchRides(startPoint.coordinates, endPoint.coordinates, date);
    }
  };

  /*******************
   *  RENDER         *
   *******************/
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error" mb={2}>
          {error}
        </Typography>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </Box>
    );
  }

  return (
    <Container>
      {/* Search Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ marginBottom: 4 }}
        className="form-cont"
      >
        {/* FROM */}
        <Form.Group controlId="from">
          <Form.Label>
            From <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            ref={fromInputEl}
            type="text"
            placeholder="Enter starting location"
            required
            value={formValues.startPoint.name}
            onChange={(e) =>
              setFormValues((v) => ({
                ...v,
                startPoint: { ...v.startPoint, name: e.target.value },
              }))
            }
          />
        </Form.Group>

        {/* TO */}
        <Form.Group controlId="to">
          <Form.Label>
            To <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            ref={toInputEl}
            type="text"
            placeholder="Enter destination"
            required
            value={formValues.endPoint.name}
            onChange={(e) =>
              setFormValues((v) => ({
                ...v,
                endPoint: { ...v.endPoint, name: e.target.value },
              }))
            }
          />
        </Form.Group>

        {/* DATE */}
        <Form.Group controlId="date">
          <Form.Label>
            Date <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="date"
            required
            value={formValues.date}
            onChange={(e) =>
              setFormValues((v) => ({ ...v, date: e.target.value }))
            }
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Search
        </Button>
      </Box>

      {/* Results */}
      {rides.length ? (
        <>
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
                        <i className="far fa-clock" />{" "}
                        {new Date(ride.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Typography>

                      <Typography variant="body" sx={{ color: "lightgreen" }}>
                        <i className="far fa-money-bill-alt" /> $
                        {ride.priceSeat.toFixed(2)}
                      </Typography>
                    </div>

                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      <i className="far fa-user" /> {ride.userName}
                    </Typography>
                    <Typography variant="body" sx={{ color: "coral" }}>
                      <i className="fas fa-glass-cheers" /> Vibe Score:{" "}
                      {ride.vibeScore} %
                    </Typography>
                  </CardContent>
                </Nav.Link>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ mx: 2, lineHeight: "2.5rem" }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="h5" align="center">
          No Rides
        </Typography>
      )}
    </Container>
  );
};

export default SearchRidesTab;
