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
import { useAuth } from "../contexts/AuthContext";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false by default
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("test");
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/v1/bookings/for-user/${currentUser.email}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Something went wrong!");
      const data = await response.json();
      setBookings(data);
      console.log(bookings);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
    <div className="your-bookings-cont">
      <Typography variant="h4">
        Your Bookings
        <button onClick={fetchBookings}>refresh</button>
      </Typography>
      {bookings.length > 0 ? (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.ride.id}>
              <Nav.Link
                as={Link}
                to={`/ride/book/${booking.ride.id}`}
                className="search-card booking-card"
              >
                <CardContent>
                  <Typography
                    sx={{ fontWeight: 700 }}
                    variant="h5"
                    component="div"
                  >
                    {booking.ride.car.make} {booking.ride.car.model}
                  </Typography>
                  <Typography sx={{ mb: 1.5, color: "white", fontWeight: 600 }}>
                    {booking.ride.startPoint.name} to{" "}
                    {booking.ride.endPoint.name}
                  </Typography>
                  <Typography variant="body2">
                    Date: {new Date(booking.ride.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Status: {booking.status}
                  </Typography>
                </CardContent>
              </Nav.Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <h3>You don't have any bookings yet</h3>
      )}
    </div>
  );
};

export default UserBookings;
