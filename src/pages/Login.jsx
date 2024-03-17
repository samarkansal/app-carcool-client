import React, { Fragment, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assuming useAuth is a custom hook you have created for authentication context
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/home"); // Redirect to the desired page after login
    } catch (error) {
      setError("Failed to log in");
      console.error(error);
    }
    setLoading(false);
  };

  // Update form fields based on input changes
  //   const onChange = (e) =>
  //     setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <section className="bg-img-login">
        <div className="dark-overlay">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="login-container form">
              <h1 className="large">Login</h1>
              <div style={{ fontSize: "44px" }}>
                <i className="fa fa-user-circle-o"></i>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  ref={emailRef} // Changed to use ref as per original intent
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  ref={passwordRef} // Changed to use ref as per original intent
                  required
                />
              </div>
              <input
                type="submit"
                value="Login"
                className="btn"
                disabled={loading}
              />
              {error && <p className="error">{error}</p>}
              <p className="my-.5">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Login;
