import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Nav.scss";

class Nav extends Component {
  render() {
    return (
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">
            <img src="" alt="" />
          </Link>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link className="navbar-item button is-info is-medium is-outlined" to="/">
              exit
            </Link>
            <Link className="navbar-item button is-success is-medium is-outlined" to="/">
              Log out
            </Link>
            <Link className="navbar-item button is-warning is-medium is-outlined" to="/signup">
              Log in / Sign up
            </Link>
            <Link className="navbar-item button is-danger is-medium is-outlined" to="/">
              Profile
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
