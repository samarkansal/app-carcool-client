import React, { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    password2: "",
  });

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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // User has been created successfully, navigate to another route or perform additional setup
        console.log("User registered:", userCredential.user);
        navigate("/"); // Redirect to homepage or dashboard
      } catch (error) {
        console.error("Error signing up:", error.message);
        // Optionally, handle or display the error more gracefully
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
