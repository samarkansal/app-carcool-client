import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";

const Landing = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <Fragment>
      <section className="bgimg-2">
        <div className="dark-overlay">
          <div className="bgimg-inner">
            <h1 className="x-large">Driving in your car soon?</h1>
          </div>
        </div>
      </section>
      <div className="desc1">
        <h2>Let's make this your least expensive journey ever.</h2>
        <p></p>
        <button className="btn" onClick={handleClick}>
          Offer a Ride
        </button>
      </div>
      <section className="bgimg-3">
        <div className="dark-overlay">
          <div className="bgimg-inner">
            <h1 className="x-large">Want A Ride?</h1>
          </div>
        </div>
      </section>
      <div className="desc1">
        <h3>Go literally anywhere. From anywhere.</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, fuga?
          Sequi facilis ducimus provident, impedit amet eveniet voluptas quam
          delectus eius laudantium, incidunt, accusamus pariatur quos mollitia
          ipsa modi velit.
        </p>
        <button className="btn" onClick={handleClick}>
          Find a Ride
        </button>
      </div>
    </Fragment>
  );
};

export default Landing;
