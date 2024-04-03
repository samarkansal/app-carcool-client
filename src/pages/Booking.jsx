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
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Booking = () => {
  const { id } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();

  const createBooking = async () => {
    try {
      // Retrieve the logged-in user's email using Firebase Auth
      const userEmail = currentUser.email;

      // If user is not logged in or email is not retrieved, throw an error
      if (!userEmail) {
        throw new Error("User must be logged in to book a ride");
      }

      // Set up the booking data
      const bookingData = {
        userId: userEmail,
        rideId: id, // This comes from the URL parameter
        bookingDate: new Date().toISOString(),
        status: "requested",
      };

      // Make the POST request to the server
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include your Firebase Auth token in the header if needed
            // 'Authorization': `Bearer ${yourAuthToken}`
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Here you can handle the response from the server, e.g., showing a message to the user
      const responseData = await response.json();
      console.log("Booking successful:", responseData);
      // Maybe update the state to reflect the successful booking...
      setBooking(responseData);
    } catch (error) {
      console.error("Error creating booking:", error);
      // Here, handle any errors that occurred during booking, e.g., show an error message
    }
  };

  const cancelBooking = async () => {
    // Ensure that there's an existing booking to cancel.
    if (!booking) {
      setMessage("There is no booking to cancel.");
      return;
    }

    try {
      const bookingUpdateData = {
        status: "cancelled",
      };

      // Send a PUT request to update the booking status to "cancelled".
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${booking.id}`, // Use the actual ID of the booking
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
        // If the server responds with an error, parse the error message
        const errorData = await response.json();
        throw new Error(errorData.detail || "Network response was not ok");
      }

      // If the server responds successfully, update the local state.
      const updatedBooking = await response.json();
      setBooking(updatedBooking); // Update your state with the new booking data.
      setMessage("Your booking has been cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setMessage(
        error.message || "An error occurred while cancelling your booking."
      );
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/rides/ride/${id}`
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
    const initMap = () => {
      if (!rideDetails) return; // Ensure ride details are loaded

      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: {
          lat: rideDetails.startPoint.coordinates[0],
          lng: rideDetails.startPoint.coordinates[1],
        }, // Assuming [longitude, latitude] format
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      const route = {
        origin: {
          lat: rideDetails.startPoint.coordinates[0],
          lng: rideDetails.startPoint.coordinates[1],
        },
        destination: {
          lat: rideDetails.endPoint.coordinates[0],
          lng: rideDetails.endPoint.coordinates[1],
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
        break;
      default:
        setMessage("");
        break;
    }
  }, [booking]);

  return (
    <div className="bgimg-booking">
      <div className="dark-overlay-darker">
        <div className="booking-cont">
          <div className="int-cont">
            {rideDetails ? (
              <div className="int2-cont">
                {/* Display ride information */}
                <div className="ride-box1">
                  <div className="ride-box2">
                    <h3>Ride Details</h3>
                    <p>Driver: {rideDetails.driverUserId}</p>
                    <p>
                      Car: {rideDetails.car.make} {rideDetails.car.model} (
                      {rideDetails.car.year})
                    </p>
                    <p>
                      Capacity: {rideDetails.capacity.occupied}/
                      {rideDetails.capacity.total}
                    </p>
                    <p>Start Point: {rideDetails.startPoint.name}</p>
                    <p>End Point: {rideDetails.endPoint.name}</p>
                  </div>
                  <div>
                    {message && <p>{message}</p>}
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
