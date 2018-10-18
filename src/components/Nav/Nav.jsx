import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Nav.scss";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.handleOnLogoutButtonClick = this.handleOnLogoutButtonClick.bind(this);
    this.handleOnLoginButtonClick = this.handleOnLoginButtonClick.bind(this);
  }
  handleOnLogoutButtonClick() {
    this.props.onLogoutButtonClick();
  }
  handleOnLoginButtonClick() {
    const { user, onLoginButtonClick } = this.props;
    onLoginButtonClick();
  }
  render() {
    const { token, user } = this.props;
    return (
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">
            <img src="" alt="" />
          </Link>
          <Link
            to=""
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </Link>
        </div>
        <div className="navbar-menu">
          {token ? (
            <div className="navbar-end">
              <button
                className="navbar-item button is-link is-small is-outlined"
                onClick={this.handleOnLogoutButtonClick}
              >
                Log out
              </button>
              <Link to={`/users/${user._id}`} className="navbar-item is-small button is-light is-outlined">
                {user.email}
              </Link>
            </div>
          ) : (
            <div className="navbar-end">
              <button
                className="navbar-item button is-warning is-small is-outlined"
                onClick={this.handleOnLoginButtonClick}
              >
                Log in / Sign up
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default Nav;
