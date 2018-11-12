import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AuthModal extends Component {
  constructor(props) {
    super(props);
    this.handleOnGitHubLoginButtonClick = this.handleOnGitHubLoginButtonClick.bind(
      this
    );
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }

  handleOnGitHubLoginButtonClick() {
    this.props.onGitHubLoginButtonClick();
  }

  handleOnCloseButtonClick() {
    this.props.onCloseButtonClick();
  }

  render() {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title is-2 is-spaced">
            access algorithm fighter with github
          </p>
          <button
            onClick={this.handleOnCloseButtonClick}
            className="delete"
            aria-label="close"
          />
        </header>
        <section className="modal-card-body">
          <button
            onClick={this.handleOnGitHubLoginButtonClick}
            className="button is-large github-login-button"
          >
            <span className="icon is-medium">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </span>
            <span>GitHub</span>
          </button>
        </section>
        <footer className="modal-card-foot" />
      </div>
    );
  }
}

export default AuthModal;
