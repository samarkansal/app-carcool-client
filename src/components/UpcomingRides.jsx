import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Button from "react-bootstrap/Button";
import { useAuth } from "../contexts/AuthContext"; // Assuming useAuth is implemented
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const UpcomingRidesTab = () => {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { currentUser } = useAuth(); // Assuming currentUser contains the logged-in user's details

  useEffect(() => {
    fetchRides();
  }, [currentUser]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const token = await currentUser.getIdToken(); // Get Firebase auth token
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rides/driver/${
        currentUser.email
      }?future=true`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong fetching rides!");
      const data = await response.json();
      const ridesWithBookings = await Promise.all(
        data.map(async (ride) => {
          const bookingsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/bookings/for-ride/${
              ride._id
            }`
          );
          if (!bookingsResponse.ok)
            throw new Error("Something went wrong fetching bookings!");
          const bookingsData = await bookingsResponse.json();
          return { ...ride, bookings: bookingsData };
        })
      );
      setRides(ridesWithBookings);
      console.log(ridesWithBookings);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingUpdate = async (bookingId, newStatus) => {
    try {
      const bookingUpdateData = { status: newStatus };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Include the token if needed: Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(bookingUpdateData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${newStatus} booking`);
      }
      setMessage(`Booking ${newStatus} successfully!`);
      setOpenSnackbar(true);
      await fetchRides();
    } catch (error) {
      console.error("Error updating booking:", error);
      setMessage(`Error: ${error.message}`);
      setOpenSnackbar(true);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          elevation={6}
          variant="filled"
        >
          {message}
        </MuiAlert>
      </Snackbar>
      <button className="btn" onClick={fetchRides}>
        <i className="fas fa-sync-alt"></i> Refresh
      </button>
      {rides.length > 0 ? (
        <div>
          {rides.map((ride) => (
            <div key={ride._id} className="rel-cont">
              <Nav.Link as={Link} to={`/ride/book/${ride._id}`}>
                <div className="upcoming-card">
                  <Typography variant="h5">
                    <p>
                      <i className="fas fa-calendar-alt"></i>{" "}
                      {new Date(ride.date).toLocaleString("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </Typography>
                  <div className="upcoming-box4">
                    <div>
                      {ride.bookings.length > 0 ? (
                        <div>
                          <h3>Ride bookings</h3>{" "}
                          {ride.bookings.map((booking) => (
                            <div key={booking.id}>
                              <div className="ride-box3 upbx">
                                <div>
                                  <p>
                                    <i className="far fa-user-circle"></i>{" "}
                                    {booking.userId}
                                  </p>
                                  <p>Status: {booking.status}</p>
                                </div>
                                <div>
                                  <Button
                                    onClick={() =>
                                      handleBookingUpdate(
                                        booking.id,
                                        "confirmed"
                                      )
                                    }
                                    disabled={booking.status === "confirmed"}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleBookingUpdate(
                                        booking.id,
                                        "rejected"
                                      )
                                    }
                                    disabled={booking.status === "rejected"}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <h2>No Bookings</h2>
                      )}
                    </div>
                    <div>
                      <p>
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        <span className="boldp">Start Point:</span>{" "}
                        {ride.startPoint.name}
                      </p>
                      <p>
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        <span className="boldp">End Point:</span>{" "}
                        {ride.endPoint.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Nav.Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No rides</p>
      )}
    </Container>
  );
};

export default UpcomingRidesTab;
