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
                className="navbar-item button is-success is-small is-outlined"
                onClick={this.handleOnLogoutButtonClick}
              >
                Log out
              </button>
              <figure className="image is-64x64">
                <Link to={`/users/${user._id}`}>
                  <img className="is-rounded" src={user.profileImageUrl} alt="" />
                </Link>
              </figure>
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
