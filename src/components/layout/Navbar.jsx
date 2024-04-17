import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Dropdown, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const firstName =
    (currentUser &&
      (currentUser.displayName
        ? currentUser.displayName.split(" ")[0]
        : currentUser.email)) ||
    "";

  const navigate = useNavigate();
  console.log(currentUser);
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <BootstrapNavbar
      variant="dark"
      expand="lg"
      className="justify-content-between navbar-custom"
    >
      <BootstrapNavbar.Brand as={Link} to="/">
        <img
          src="/images/carcool-logo3.png"
          alt="CarCool Logo"
          className="carcool-logo" // Adjust logo size as needed
        />
      </BootstrapNavbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="#!">
          About
        </Nav.Link>{" "}
        {}
        {currentUser ? (
          <div className="dynamic-nav-link">
            <Nav.Link as={Link} to="/home">
              Rides
            </Nav.Link>{" "}
            <Dropdown className="nav-dropdown">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Hi {firstName}{" "}
              </Dropdown.Toggle>

              <Dropdown.Menu className="drop-menu">
                <Dropdown.Item as={Link} to="/preferences">
                  Preferences
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </>
        )}
      </Nav>
    </BootstrapNavbar>
  );
};

export default Navbar;
