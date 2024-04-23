import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateRideTab = () => {
  const [formValues, setFormValues] = useState({
    startPoint: { name: "", coordinates: [0, 0] },
    endPoint: { name: "", coordinates: [0, 0] },
    date: "",
    capacityTotal: "",
    capacityOccupied: "",
    stopPoints: [{ name: "", coordinates: [] }], // Initially empty
    status: "IN_PROGRESS", // Hardcoded
    car: {
      // Hardcoded
      make: "BMW",
      model: "3 Series",
      year: 2020,
      color: "Green",
      plateNumber: "EV6753",
    },
    priceSeat: "",
  });
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const { currentUser } = useAuth();
  console.log(currentUser.email);

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

    initAutocomplete(fromRef, "startPoint");
    initAutocomplete(toRef, "endPoint");
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "capacity" || id === "priceSeat" || id === "date") {
      setFormValues((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          name: value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combine date and time into a single ISO string
    const rideDateTime = new Date(`${formValues.date}T${formValues.startTime}`);
    const isoRideDateTime = rideDateTime.toISOString();
    const rideData = {
      driverUserId: currentUser.email, // Example user ID
      startPoint: {
        name: formValues.startPoint.name,
        location: {
          type: "Point",
          coordinates: formValues.startPoint.coordinates,
        },
      },
      endPoint: {
        name: formValues.endPoint.name,
        location: {
          type: "Point",
          coordinates: formValues.endPoint.coordinates,
        },
      },
      stopPoints: [], // Assuming no stop points for simplicity
      capacity: {
        total: 3,
        occupied: 0,
      },
      car: formValues.car,
      bookings: [],
      status: formValues.status,
      date: isoRideDateTime,
      priceSeat: parseFloat(formValues.priceSeat),
    };
    try {
      console.log(rideData);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/rides/ride`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rideData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create ride");
      }

      const data = await response.json();
      console.log(data);
      alert("Ride created successfully");
    } catch (error) {
      console.error("Failed to create ride:", error);
      alert("Failed to create ride");
    }
  };

  return (
    <Container style={{}}>
      <Box
        className="form-cont"
        component="form"
        onSubmit={handleSubmit}
        sx={{ marginBottom: 4 }}
      >
        <Form.Group>
          <Form.Label>
            From<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            ref={fromRef}
            type="text"
            placeholder="Enter starting location"
            value={formValues.startPoint.name}
            onChange={(e) => handleChange(e)}
            id="startPoint"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            To<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            ref={toRef}
            type="text"
            placeholder="Enter destination"
            value={formValues.endPoint.name}
            onChange={(e) => handleChange(e)}
            id="endPoint"
            required
          />
        </Form.Group>

        <Form.Group controlId="capacity">
          <Form.Label>
            Capacity<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="Available seats"
            onChange={(e) =>
              setFormValues({ ...formValues, capacity: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>
            Date<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="date"
            onChange={(e) =>
              setFormValues({ ...formValues, date: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="startTime">
          <Form.Label>
            Start Time<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="time"
            onChange={(e) =>
              setFormValues({ ...formValues, startTime: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="priceSeat">
          <Form.Label>
            Price per Seat<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Price per seat"
            onChange={(e) =>
              setFormValues({ ...formValues, priceSeat: e.target.value })
            }
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
          Create Ride
        </Button>
      </Box>
    </Container>
  );
};

export default CreateRideTab;
