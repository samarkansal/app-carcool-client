import React from "react";

const Footer = () => {
  return (
    <footer className="global-footer">
      <img
        className="carcool-logo"
        alt="description of img"
        src="/images/carcool-logo3.png"
      />
      <section className="footer-sep">
        <ul>
          <h4>Explore</h4>
          <li>
            <a href="/#">Home</a>
          </li>
          <li>
            <a href="/#">About</a>
          </li>
          <li>
            <a href="/#">Career</a>
          </li>
          <li>
            <a href="/#">FAQ's</a>
          </li>
        </ul>
        <ul>
          <h4>Visit</h4>
          <li>
            <a href="https://maps.app.goo.gl/jh1TwFm9WYiUyLMD9">
              620 Drillfield Dr, Blacksburg, VA 24060
            </a>
          </li>
        </ul>
        <ul>
          <h4>New Business</h4>
          <li>
            <a href="/#">
              <i className="fa fa-envelope fa-fw"></i> sameerkansal27
            </a>
          </li>
          <li>
            <a href="/#">
              <i className="fa fa-mobile fa-fw"></i>+919812794534
            </a>
          </li>
        </ul>
        <ul>
          <h4>Follow</h4>
          <li>
            <a href="/#">
              <i className="fa fa-instagram fa-fw"></i>Instagram
            </a>
          </li>
          <li>
            <a href="/#">
              <i className="fa fa-facebook fa-fw"></i>Facebook
            </a>
          </li>
          <li>
            <a href="/#">
              <i className="fa fa-twitter fa-fw"></i>Twitter
            </a>
          </li>
        </ul>
        <ul>
          <h4>Legal</h4>
          <li>
            <a href="/#">Terms</a>
          </li>
          <li>
            <a href="/#">Privacy</a>
          </li>
        </ul>
      </section>
      <section className="footer-sep">
        <p>&copy; 2024 CarCool. All Rights Reserved.</p>
      </section>
    </footer>
  );
};

export default Footer;
