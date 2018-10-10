import React, { Component } from "react";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.handlOnGitHubLoginButtonClick = this.handlOnGitHubLoginButtonClick.bind(this);
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }
  handlOnGitHubLoginButtonClick() {
    this.props.onGitHubLoginButtonClick();
  }

  handleOnCloseButtonClick() {
    this.props.onCloseButtonClick();
  }
  render() {
    const { isActive } = this.props;
    console.log(isActive)
    return (
      <div className="modal is-active">
        <div className="modal-background">
          <div className="modal-content">
            <button onClick={this.handlOnGitHubLoginButtonClick} className="button is-large">
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
