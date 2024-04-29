import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useAuth } from "../contexts/AuthContext"; // Ensure this is correctly imported

const Preferences = () => {
  const [key, setKey] = useState("basicInfo");
  const { currentUser } = useAuth();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    car_info: {
      make: "",
      model: "",
      year: "",
      color: "",
      plate_number: "",
    },
    preferences: [],
  });

  const categories = {
    Lifestyle: [
      "Self-care",
      "Spa",
      "Meditation",
      "Gym",
      "Yoga",
      "Hot yoga",
      "Wellness retreats",
      "Minimalism",
      "Sustainable living",
      "Gardening",
      "Home decor",
      "Fashion",
      "Beauty",
      "Aromatherapy",
      "Personal development",
    ],
    Entertainment: [
      "Harry Potter",
      "Netflix",
      "Theatre",
      "Spotify",
      "SoundCloud",
      "Live music",
      "Stand-up comedy",
      "Video games",
      "Board games",
      "Anime",
      "Comic books",
      "Book club",
      "Movie nights",
      "Karaoke",
      "Dance parties",
    ],
    "Outdoor Activities": [
      "Hiking",
      "Camping",
      "Fishing",
      "Canoeing",
      "Surfing",
      "Mountain biking",
      "Rock climbing",
      "Bird watching",
      "Photography",
      "Geocaching",
      "Skiing",
      "Snowboarding",
      "Kite surfing",
      "Paragliding",
      "Horseback riding",
    ],
    "Food & Drink": [
      "Sushi",
      "Coffee",
      "Craft beer",
      "Gin & tonic",
      "Foodie tour",
      "Vegan cuisine",
      "Wine tasting",
      "Baking",
      "Cooking classes",
      "Farmers markets",
      "Mixology",
      "Ethnic cuisines",
      "Cheese tasting",
      "Chocolate making",
      "Barbecue",
    ],
    "Professional & Networking": [
      "Social development",
      "Freelance",
      "Start-ups",
      "Digital Marketing",
      "Networking events",
      "Entrepreneurship",
      "Professional development",
      "Tech meetups",
      "Creative writing",
      "Investing",
      "Public speaking",
      "Mentorship",
      "Leadership workshops",
      "Coding bootcamps",
      "Business analytics",
    ],
    Sports: [
      "Football",
      "Basketball",
      "Hockey",
      "Cricket",
      "Tennis",
      "Golf",
      "Running",
      "Cycling",
      "Swimming",
      "Martial arts",
      "Yoga sports",
      "Gymnastics",
      "Archery",
      "Pilates",
      "Bowling",
    ],
    Technology: [
      "Gadgets",
      "Programming",
      "Web development",
      "AI and robotics",
      "Cybersecurity",
      "Gaming",
      "Virtual reality",
      "Drones",
      "Tech DIY",
      "Smart home technology",
      "Data science",
      "Machine learning",
      "Blockchain",
      "E-sports",
      "Mobile app development",
    ],
    "Culture & Arts": [
      "Museums",
      "Painting",
      "Sculpture",
      "Photography",
      "Dance",
      "Opera",
      "Symphony",
      "Ballet",
      "Film making",
      "Creative arts",
      "Literature",
      "Fashion design",
      "Theater production",
      "Art history",
      "Pottery",
    ],
    Travel: [
      "Road trips",
      "Backpacking",
      "Cruise vacations",
      "Adventure travel",
      "Historical travel",
      "Luxury travel",
      "Eco-tourism",
      "Volunteer travel",
      "Cultural exchange",
      "Language learning",
      "City tours",
      "Wildlife safaris",
      "Scuba diving",
      "Mountaineering",
      "Festival hopping",
    ],
    Others: [
      "DIY",
      "Upcycling",
      "Vintage clothing",
      "Vintage fashion",
      "Voguing",
      "Pet care",
      "Astrology",
      "Board games",
      "Magic and illusions",
      "Podcasting",
      "Origami",
      "Gardening",
      "Knitting",
      "Home brewing",
      "Aquascaping",
    ],
  };

  // State to hold selected options for each category
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        console.log(token);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/firebase/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        console.log(data);
        if (!response.ok)
          throw new Error(data.message || "Could not fetch user data");
        setUser(data);

        Object.keys(categories).forEach((category) => {
          selectedOptions[category] = categories[category]
            .filter((interest) => data.preferences.includes(interest))
            .map((interest) => ({ value: interest, label: interest }));
        });
        setSelectedOptions({ ...selectedOptions });
      } catch (error) {
        console.error("Failed to fetch user data", error.message);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }
    try {
      const newPrefs = Object.values(selectedOptions).reduce(
        (acc, category) => {
          const values = category.map((item) => item.value);
          return acc.concat(values);
        },
        []
      );
      user.preferences = newPrefs;
      console.log(user);
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Could not update user data");
      alert("User information updated successfully!");
    } catch (error) {
      console.error("Failed to update user data", error.message);
    }
  };

  const handleChange = (event, section, field) => {
    setUser((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value,
      },
    }));
  };

  const handleInterestChange = (selected, { name }) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: selected,
    }));
    console.log(selectedOptions);
  };

  return (
    <div className="bgimg-user-info">
      <div className="dark-overlay-user">
        <Container className="home-container">
          <h1 className="cont-title">User Preferences</h1>
          <Tabs
            id="preferences-tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="basicInfo" title="Basic Info">
              <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={user.first_name}
                    onChange={(e) => handleChange(e, "basicInfo", "first_name")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={user.last_name}
                    onChange={(e) => handleChange(e, "basicInfo", "last_name")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter mobile number"
                    value={user.mobile}
                    onChange={(e) => handleChange(e, "basicInfo", "mobile")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={user.email}
                    onChange={(e) => handleChange(e, "basicInfo", "email")}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="car_info" title="Car Info">
              <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3" controlId="formCarMake">
                  <Form.Label>Make</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter car make"
                    value={user.car_info.make}
                    onChange={(e) => handleChange(e, "car_info", "make")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarModel">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter car model"
                    value={user.car_info.model}
                    onChange={(e) => handleChange(e, "car_info", "model")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter car year"
                    value={user.car_info.year}
                    onChange={(e) => handleChange(e, "car_info", "year")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarColor">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter car color"
                    value={user.car_info.color}
                    onChange={(e) => handleChange(e, "car_info", "color")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCarplate_number">
                  <Form.Label>Plate Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter plate number"
                    value={user.car_info.plate_number}
                    onChange={(e) =>
                      handleChange(e, "car_info", "plate_number")
                    }
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Save Car Info
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="interests" title="Interests">
              <Form onSubmit={handleUpdate}>
                {Object.keys(categories).map((category) => (
                  <Form.Group key={category} className="mb-3">
                    <Form.Label>{category}</Form.Label>
                    <Select
                      isMulti
                      name={category}
                      options={categories[category].map((interest) => ({
                        label: interest,
                        value: interest,
                      }))}
                      className="basic-multi-select"
                      classNamePrefix="custom-select"
                      value={selectedOptions[category]}
                      onChange={(selected) =>
                        handleInterestChange(selected, { name: category })
                      }
                    />
                  </Form.Group>
                ))}
                <Button variant="primary" type="submit">
                  Save Interests
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default Preferences;
