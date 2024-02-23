import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <img
            src="/images/carcool-logo3.png"
            alt="CarCool Logo"
            className="carcool-logo"
          />
        </Link>
      </h1>
      <ul>
        <li>
          <a href="!#">About</a>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
