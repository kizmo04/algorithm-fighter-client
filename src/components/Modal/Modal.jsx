import React, { Component } from "react";
import "./Modal.scss";
import { AUTH, MATCH } from "../../constants/modalTypes";
import AuthModal from "../AuthModal/AuthModal";
import MatchModal from '../MatchModal/MatchModal';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }

  handleOnCloseButtonClick() {
    this.props.onCloseButtonClick();
  }
  render() {
    const { isActive, modalType, modalMessage, onGitHubLoginButtonClick, appStage, matchPartner, onAcceptButtonClick, combatRoomKey, onCancelButtonClick, onRetryButtonClick, onChangeMatchingStage, onCloseButtonClick, user } = this.props;
    return (
      <section className="section is-medium">
        <div className="container">
          <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background"></div>
              <div className="modal-content">
                {
                  modalType === AUTH ? <AuthModal onCloseButtonClick={onCloseButtonClick} onGitHubLoginButtonClick={onGitHubLoginButtonClick} /> :
                  modalType === MATCH ? <MatchModal onChangeStage={onChangeMatchingStage} onRetryButtonClick={onRetryButtonClick} combatRoomKey={combatRoomKey} onCloseButtonClick={onCloseButtonClick} onCancelButtonClick={onCancelButtonClick} onAcceptButtonClick={onAcceptButtonClick} user={user} matchPartner={matchPartner} stage={appStage} message={modalMessage}/>
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

export default Modal;
