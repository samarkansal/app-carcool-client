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
      <button onClick={fetchRides}>Refresh</button>
      {rides.length > 0 ? (
        <div>
          {rides.map((ride) => (
            <Card key={ride.id}>
              <CardContent>
                <Typography variant="h5">
                  {ride.car.make} {ride.car.model}
                </Typography>
                {/* Display booking details */}
                {ride.bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent>
                      <Typography>User: {booking.userId}</Typography>
                      <Typography>Status: {booking.status}</Typography>
                      <Button onClick={() => handleConfirm(booking.id)}>
                        Confirm
                      </Button>
                      <Button onClick={() => handleReject(booking.id)}>
                        Reject
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No rides</p>
      )}
    </Container>
  );
};

export default UpcomingRidesTab;
