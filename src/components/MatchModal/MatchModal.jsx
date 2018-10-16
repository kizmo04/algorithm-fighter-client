import React, { Component } from "react";
import {
  APP_STAGE_FIND_MATCH_PARTNER,
  APP_STAGE_PENDING_MATCH_ACCEPTANCE,
  APP_STAGE_RECEIVING_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_UNAVAILABLE,
} from '../../constants/modalTypes';


class MatchModal extends Component {
  constructor(props) {
    super(props);
    this.handleAcceptButtonClick = this.handleAcceptButtonClick.bind(this);
    this.handleCancelButtonClick = this.handleCancelButtonClick.bind(this);
    this.handleRetryButtonClick = this.handleRetryButtonClick.bind(this);
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }

  handleAcceptButtonClick () {
    const { combatRoomKey, user, onAcceptButtonClick } = this.props;
    onAcceptButtonClick({ combatRoomKey, guestUser: user });
  }

  handleCancelButtonClick () {
    const { combatRoomKey, user, onCancelButtonClick } = this.props;
    onCancelButtonClick({ combatRoomKey, guestUser: user });
  }

  handleRetryButtonClick () {
    const { onRetryButtonClick, user, combatRoomKey } = this.props;
    onRetryButtonClick(user, combatRoomKey);
  }

  handleOnCloseButtonClick() {
    const { onCloseButtonClick } = this.props;
    onCloseButtonClick();
  }

  render() {
    const { modalMessage, appStage, matchPartner } = this.props;
    return (
      <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title is-2 is-spaced">매칭 중</p>
        <button onClick={this.handleOnCloseButtonClick} className="delete" aria-label="close"></button>
      </header>
      <section className="modal-card-body">
      {
        appStage === APP_STAGE_FIND_MATCH_PARTNER || appStage === APP_STAGE_PENDING_MATCH_ACCEPTANCE ? <span className="subtitle is-2">{modalMessage}</span> :
        appStage === APP_STAGE_RECEIVING_MATCH_INVITATION ? (
          <div>
            <img alt="" src={matchPartner.profileImageUrl}/>
            <span>{matchPartner.email}님과 대결하시겠습니까?</span>
            <button className="button is-small" onClick={this.handleAcceptButtonClick}>수락</button>
            <button className="button is-small" onClick={this.handleCancelButtonClick}>거절</button>
          </div>
        ) :
        appStage === APP_STAGE_MATCH_PARTNER_UNAVAILABLE || appStage === APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION ? (
          <div>
            <span>{modalMessage}</span>
            <button className="button is-small" onClick={this.handleRetryButtonClick}>다시 찾기</button>
          </div>
        ) : null
      }
      </section>
      <footer className="modal-card-foot">
      </footer>
    </div>
    );
  }
}

export default MatchModal;
