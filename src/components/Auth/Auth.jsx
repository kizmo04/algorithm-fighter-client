import React, { Component } from "react";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.handleOnGitHubLoginButtonClick = this.handleOnGitHubLoginButtonClick.bind(this);
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }
  handleOnGitHubLoginButtonClick() {
    this.props.onGitHubLoginButtonClick();
  }

  handleOnCloseButtonClick() {
    this.props.onCloseButtonClick();
  }
  render() {
    const { isActive } = this.props;
    console.log(isActive)
    return (
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <div className="modal-background">
          <div className="modal-content">
            <button onClick={this.handleOnGitHubLoginButtonClick} className="button is-large">
              <span className="icon is-medium">
                <i className="fab fa-github" />
              </span>
              <span>GitHub</span>
            </button>
          </div>
        </div>
        <button onClick={this.handleOnCloseButtonClick} className="modal-close is-large" aria-label="close" />
      </div>
    );
  }
}

export default Auth;
