import React, { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
} from "firebase/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    password2: "",
  });

  let userCredential = null;

  // Destructure formData for easy access
  const { name, email, mobile, password, password2 } = formData;

  const navigate = useNavigate(); // Hook for redirecting after successful signup
  const auth = getAuth(); // Get the Firebase Auth instance

  // Handle form field changes
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log("Passwords do not match");
      // Optionally, handle this error more gracefully in your UI
    } else {
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Setting the display name
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        // Extract token and UID for database creation and potential rollback
        const token = await userCredential.user.getIdToken();
        const uid = userCredential.user.uid;

        const [first_name, ...lastName] = name.split(" ");
        console.log(first_name);
        console.log(lastName);
        const userData = {
          firebaseUID: userCredential.user.uid,
          first_name,
          last_name: lastName.join(" "), // Joining the rest as lastName
          mobile,
          email: userCredential.user.email,
          // Assuming defaults or empty values for fields not provided by the form
          car_info: {
            make: "",
            model: "",
            year: 0,
            color: "",
            plate_number: "",
          },
          profile_picture: "",
          preferences: [],
        };

        // Try to create user in database
        const dbResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          }
        );

        if (!dbResponse.ok) {
          throw new Error("Failed to create user in DB");
        }

        navigate("/preferences");
      } catch (error) {
        console.error("Error:", error.message);

        // Rollback Firebase user if DB creation fails
        if (error.message === "Failed to create user in DB") {
          deleteUser(userCredential.user)
            .then(() => {
              console.log("Firebase user deleted due to DB creation failure");
            })
            .catch((deleteError) => {
              console.error("Failed to delete Firebase user:", deleteError);
            });
        }
      }
    }
  };

  return (
    <Fragment>
      <section className="bgimg-4">
        <div className="dark-overlay">
          <div className="form-container">
            <h1 className="large">Sign Up</h1>
            <p className="lead">Create an Account</p>
            <div style={{ fontSize: "44px" }}>
              <i className="fa fa-user-plus"></i>
            </div>
            <form className="login-container form" onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  required
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  required
                  title="This site uses Gravatar, so if you want a profile image, use a Gravatar email"
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Mobile"
                  name="mobile"
                  value={mobile}
                  required
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  required
                  minLength="6"
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  required
                  minLength="6"
                  onChange={onChange}
                />
              </div>
              <input type="submit" value="Register" className="btn" />
            </form>
            <p className="my-1">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Register;
