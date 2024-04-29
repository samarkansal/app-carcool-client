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
      const token = await currentUser.getIdToken(); // Get Firebase auth token
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request
          "Content-Type": "application/json",
        },
      });
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "cancelled":
      case "rejected":
        return <i className="fas fa-ban"></i>;
      case "confirmed":
        return <i className="far fa-calendar-check"></i>;
      default:
        return <i className="fas fa-hourglass-half"></i>;
    }
  };

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div className="your-bookings-cont">
      <h3>
        Your Bookings
        {/* <button onClick={fetchBookings}>refresh</button> */}
      </h3>
      {bookings.length > 0 ? (
        <div className="bcard-cont" spacing={3}>
          {bookings.map((booking) => (
            <div key={booking.ride.id}>
              <Nav.Link
                as={Link}
                to={`/ride/book/${booking.ride.id}`}
                className="search-card booking-card"
              >
                <CardContent>
                  <Typography
                    sx={{ fontWeight: 600 }}
                    variant="h5"
                    component="div"
                  >
                    {getStatusIcon(booking.status)}{" "}
                    {capitalizeFirstLetter(booking.status)}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 400 }}
                    variant="h6"
                    component="div"
                  >
                    {new Date(booking.ride.date).toLocaleString("en-US", {
                      weekday: "short", // "Sat"
                      day: "2-digit", // "09"
                      month: "short", // "Mar"
                      hour: "2-digit", // "11"
                      minute: "2-digit", // "30"
                      hour12: true, // Use AM/PM
                    })}
                  </Typography>
                  <Typography sx={{ mb: 1.5, fontWeight: 600 }}>
                    {booking.ride.startPoint.name} to{" "}
                    {booking.ride.endPoint.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5, fontWeight: 600 }}>
                    <i className="far fa-user-circle"></i>{" "}
                    {booking.ride.userName}
                  </Typography>
                </CardContent>
              </Nav.Link>
            </div>
          ))}
        </div>
      ) : (
        <h5>You don't have any bookings yet</h5>
      )}
    </div>
  );
};

export default UserBookings;
