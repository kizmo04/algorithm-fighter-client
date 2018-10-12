import React, { Component } from "react";
import "./Modal.scss";
import { AUTH, MATCHING } from "../../constants/modalTypes";
import ModalAuth from "../ModalAuth/ModalAuth";
import ModalMatching from '../ModalMatching/ModalMatching';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }

  handleOnCloseButtonClick() {
    this.props.onCloseButtonClick();
  }
  render() {
    const { isActive, modalType, modalMessage, onGitHubLoginButtonClick, matchingStage, matchingUser, onAcceptButtonClick, combatRoomKey } = this.props;
    console.log(isActive);
    return (
      <section className="section is-medium">
        <div className="container">
          <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background"></div>
              <div className="modal-content">
                {
                  modalType === AUTH ? <ModalAuth onGitHubLoginButtonClick={onGitHubLoginButtonClick} /> :
                  modalType === MATCHING ? <ModalMatching combatRoomKey={combatRoomKey} onAcceptButtonClick={onAcceptButtonClick} user={matchingUser} stage={matchingStage} message={modalMessage}/>
                  : null
                }
              </div>
            <button
              onClick={this.handleOnCloseButtonClick}
              className="modal-close is-large"
              aria-label="close"
            />
          </div>
        </div>
      </section>
    );
  }
}

export default Auth;
