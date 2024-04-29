import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Tabs,
  Tab,
} from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Booking = () => {
  const { id } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [snackMsg, setSnackMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const createBooking = async () => {
    try {
      const userEmail = currentUser.email;
      if (!userEmail) {
        throw new Error("User must be logged in to book a ride");
      }
      const bookingData = {
        userId: userEmail,
        rideId: id,
        bookingDate: new Date().toISOString(),
        status: "requested",
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setBooking(responseData);
      setMessage("Booking requested successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      setMessage("Failed to request booking.");
      setSnackbarOpen(true);
    }
  };

  const cancelBooking = async () => {
    if (!booking) {
      setMessage("There is no booking to cancel.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const bookingUpdateData = { status: "cancelled" };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${booking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingUpdateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Network response was not ok");
      }

      const updatedBooking = await response.json();
      setBooking(updatedBooking);
      setMessage("Your booking has been cancelled successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setMessage("Failed to cancel booking.");
      setSnackbarOpen(true);
    }
  };

  // Fetch both the ride details and the booking status
  useEffect(() => {
    const fetchData = async () => {
      await fetchRideDetails();
      await fetchBookingStatus();
      console.log(booking);
    };

    fetchData();
  }, [id, currentUser]);

  const fetchRideDetails = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/rides/ride/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRideDetails(data.result[0]); // Assuming the first result is the desired one
    } catch (error) {
      console.error("Error fetching ride details:", error);
    }
  };

  const fetchBookingStatus = async () => {
    if (!currentUser) return;
    // Replace the URL with the endpoint that checks the booking status for the current user and ride
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/bookings/check-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include your Firebase Auth token in the header if needed
        },
        body: JSON.stringify({ userId: currentUser.email, rideId: id }),
      }
    );

    const data = await response.json();
    console.log(data);
    setBooking(data); // Update this line based on your actual API response
  };

  // After your component definition

  useEffect(() => {
    console.log(rideDetails);
    const initMap = () => {
      if (!rideDetails) return; // Ensure ride details are loaded

      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: {
          lat: rideDetails.startPoint.location.coordinates[1],
          lng: rideDetails.startPoint.location.coordinates[0],
        },
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ], // Assuming [longitude, latitude] format
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      const route = {
        origin: {
          lat: rideDetails.startPoint.location.coordinates[1],
          lng: rideDetails.startPoint.location.coordinates[0],
        },
        destination: {
          lat: rideDetails.endPoint.location.coordinates[1],
          lng: rideDetails.endPoint.location.coordinates[0],
        },
        travelMode: "DRIVING",
      };

      directionsService.route(route, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    };

    if (window.google && rideDetails) {
      initMap();
    }
  }, [rideDetails]);

  // Decide what to display based on the booking status
  useEffect(() => {
    if (!booking) {
      setMessage("You can request to book this ride.");
      return;
    }

    switch (booking.status) {
      case "requested":
        setMessage("You have already requested a booking for this ride.");
        setSnackMsg("Booking Requested Sucessfully");
        break;
      case "confirmed":
        setMessage("Your booking for this ride is confirmed.");
        break;
      case "rejected":
        setMessage(
          "Your previous booking request was rejected. You can try to book again."
        );
        break;
      case "cancelled":
        setMessage("You have cancelled your booking for this ride.");
        setSnackMsg("Booking Cancelled");
        break;
      default:
        setMessage("");
        break;
    }
  }, [booking]);

  return (
    <div className="bgimg-booking">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
      <div className="dark-overlay-darker">
        <div className="booking-cont">
          <div className="int-cont">
            {rideDetails ? (
              <div className="int2-cont">
                {/* Display ride information */}
                <div className="b-heading">
                  Ride Details
                  {/* <button onClick={fetchBookings}>refresh</button> */}
                </div>
                <div className="ride-box1">
                  <div className="ride-box2">
                    <p>
                      <i className="fas fa-calendar-alt"></i>{" "}
                      {new Date(rideDetails.date).toLocaleString("en-US", {
                        weekday: "short", // "Sat"
                        day: "2-digit", // "09"
                        month: "short", // "Mar"
                        hour: "2-digit", // "11"
                        minute: "2-digit", // "30"
                        hour12: true, // Use AM/PM
                      })}
                    </p>
                    <p>
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      <span className="boldp">Start Point:</span>{" "}
                      {rideDetails.startPoint.name}
                    </p>
                    <p>
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      <span className="boldp">End Point:</span>{" "}
                      {rideDetails.endPoint.name}
                    </p>
                    {message && (
                      <p className="info-msg">
                        <i className="fas fa-info-circle"></i> {message}
                      </p>
                    )}
                    {!booking ||
                    booking.status === "rejected" ||
                    booking.status === "cancelled" ? (
                      <Button onClick={createBooking}>Request to Book</Button>
                    ) : (
                      <Button variant="danger" onClick={cancelBooking}>
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                  <div className="ride-box3">
                    <p className="user-card-head">
                      <i className="far fa-user-circle"></i>{" "}
                      {rideDetails.userName}
                    </p>
                    <p>
                      <i className="fas fa-car"></i>
                      {" :"} {rideDetails.car.make} {rideDetails.car.model} (
                      {rideDetails.car.year})
                    </p>
                    <p>
                      <span className="boldp">Capacity:</span>{" "}
                      {rideDetails.capacity.occupied}/
                      {rideDetails.capacity.total}
                    </p>
                    <p>
                      <i className="far fa-star"></i> Ratings: 4.3/5 - 53
                      ratings
                    </p>
                    <p>
                      {" "}
                      <i className="fas fa-glass-cheers"></i> Vibe Score:{" "}
                      {rideDetails.vibeScore} %
                    </p>
                  </div>
                </div>
                {/* Additional ride details here */}

                {/* Placeholder for Google Maps */}
                <div
                  className="map-cont"
                  id="map"
                  style={{ height: "500px", width: "100%" }}
                ></div>
              </div>
            ) : (
              <p>Loading ride details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
