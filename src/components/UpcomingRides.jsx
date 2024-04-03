import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Button from "react-bootstrap/Button";
import { useAuth } from "../contexts/AuthContext"; // Assuming useAuth is implemented

const UpcomingRidesTab = () => {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth(); // Assuming currentUser contains the logged-in user's details

  useEffect(() => {
    fetchRides();
  }, [currentUser]);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      // Update the URL to include filtering by driverUserId and future dates
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/rides/driver/${
        currentUser.email
      }?future=true`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Something went wrong fetching rides!");
      const data = await response.json();
      //console.log(data);
      // For each ride, fetch associated bookings
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
      console.log(ridesWithBookings);
      setRides(ridesWithBookings);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleConfirm = async (bookingId) => {
    try {
      const bookingUpdateData = {
        status: "confirmed",
      };

      // Send a PUT request to update the booking status to "confirmed".
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // If you're using Firebase Auth or any other authentication mechanism,
            // you should include the user's token in the Authorization header.
            // 'Authorization': `Bearer ${userToken}`
          },
          body: JSON.stringify(bookingUpdateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to confirm booking");
      }

      // Optionally, refresh the rides to show the updated booking status
      await fetchRides();
    } catch (error) {
      console.error("Error confirming booking:", error);
      // Handle the error, possibly by setting an error state or showing a notification
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const bookingUpdateData = {
        status: "rejected",
      };

      // Send a PUT request to update the booking status to "rejected".
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Include authentication token if necessary
          },
          body: JSON.stringify(bookingUpdateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to reject booking");
      }

      // Optionally, refresh the rides to show the updated booking status
      await fetchRides();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      // Handle the error, possibly by setting an error state or showing a notification
    }
  };

  return (
    <Container>
      {/* <button onClick={fetchRides}>Refresh</button> */}
      {rides.length > 0 ? (
        <div>
          {rides.map((ride) => (
            <div key={ride.id}>
              <div className="upcoming-card">
                <Typography variant="h5">
                  <p>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {new Date(ride.date).toLocaleString("en-US", {
                      weekday: "short", // "Sat"
                      day: "2-digit", // "09"
                      month: "short", // "Mar"
                      hour: "2-digit", // "11"
                      minute: "2-digit", // "30"
                      hour12: true, // Use AM/PM
                    })}
                  </p>
                </Typography>
                {/* Display booking details */}
                <div className="upcoming-box4">
                  <div>
                    {ride.bookings.map((booking) => (
                      <div key={booking.id}>
                        <div className="ride-box3 upbx">
                          <div>
                            {" "}
                            <p>
                              <i className="far fa-user-circle"></i>{" "}
                              {booking.userId}
                            </p>
                            <p>
                              <i className="far fa-star"></i> Ratings: 4.3/5 -
                              53 ratings
                            </p>
                            <p>
                              {" "}
                              <i className="fas fa-glass-cheers"></i> Vibe
                              Score: 86%
                            </p>
                            <p>Status: {booking.status}</p>
                          </div>
                          <div>
                            <Button onClick={() => handleConfirm(booking.id)}>
                              <i className="fas fa-calendar-check"></i> Confirm
                            </Button>
                            <Button onClick={() => handleReject(booking.id)}>
                              <i className="far fa-window-close"></i> Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
