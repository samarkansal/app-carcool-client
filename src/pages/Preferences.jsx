import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

// update the UI so it is consistent with the Register.jsx file

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    bio: "",
    ride: "",
    music: "",
    coPassengers: "",
    role: "", // New option for choosing driver or carpooler
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the preferences data to your server
    console.log(preferences);
    navigate("/dashboard"); // Redirect to dashboard after saving preferences
  };

  return (
    <Fragment>
      <section className="bgimg-4">
        <div className="dark-overlay">
          <div className="container">
            <h1>Set Preferences</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Bio:</label>
                <textarea
                  className="form-control"
                  name="bio"
                  value={preferences.bio}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ride Preference:</label>
                <select
                  className="form-control"
                  name="ride"
                  value={preferences.ride}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="silent">Silent</option>
                  <option value="talkative">Talkative</option>
                </select>
              </div>
              <div className="form-group">
                <label>Music Preference:</label>
                <select
                  className="form-control"
                  name="music"
                  value={preferences.music}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Co-Passengers:</label>
                <textarea
                  className="form-control"
                  name="coPassengers"
                  value={preferences.coPassengers}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  className="form-control"
                  name="role"
                  value={preferences.role}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="driver">Driver</option>
                  <option value="carpooler">Carpooler</option>
                </select>
              </div>
              <button type="submit" className="btn btn-secondary">
                Save
              </button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Preferences;
