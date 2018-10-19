import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom'
import {
  APP_STAGE_FIND_MATCH_PARTNER,
  APP_STAGE_PENDING_MATCH_ACCEPTANCE,
  APP_STAGE_RECEIVING_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_UNAVAILABLE,
  APP_STAGE_MATCH_PREPARATION,
  APP_STAGE_MATCH_PROBLEM_FETCHED,
  APP_STAGE_MATCH_END,
  APP_STAGE_MATCH_SUSPENDED,
  APP_STAGE_ACCEPT_MATCH_INVITATION,
  APP_STAGE_USER_GIVE_UP_MATCH,
} from '../../constants/modalTypes';
import './MatchModal.scss';

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
    const { modalMessage, appStage, matchPartner, matchResult, user, isFetching } = this.props;
    return (
      <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title subtitle is-small is-spaced">{appStage === APP_STAGE_MATCH_END ? '결과' : '매칭 중'}</p>
        <button onClick={this.handleOnCloseButtonClick} className="delete" aria-label="close"></button>
      </header>
      <section className="modal-card-body">
      {
        appStage === APP_STAGE_FIND_MATCH_PARTNER || appStage === APP_STAGE_PENDING_MATCH_ACCEPTANCE ? <span className="subtitle is-small">{modalMessage}</span> :
        appStage === APP_STAGE_RECEIVING_MATCH_INVITATION ? (
          <div className="columns">
            <div className="column is-two-third match-modal invitation-message-container">
              <figure className="image is-64x64 user-profile-image match-modal">
                <img className="is-rounded" src={matchPartner.profileImageUrl} alt="" />
              </figure>
              <span className="subtitle is-small match-modal-message invitation">{matchPartner.userName}의 결투신청</span>
            </div>
            <div className="column is-one-third">
              <button className="button is-small is-fullwidth is-danger invitaion-button" onClick={this.handleAcceptButtonClick}>수락</button>
              <button className="button is-small is-fullwidth is-white invitaion-button" onClick={this.handleCancelButtonClick}>거절</button>
            </div>
          </div>
        ) :
        appStage === APP_STAGE_MATCH_PARTNER_UNAVAILABLE || appStage === APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION ? (
          <div className="columns">
            <div className="column is-two-third">
              <span className="subtitle is-small">{modalMessage}</span>
            </div>
            <div className="column is-one-third">
              <button className="button is-small" onClick={this.handleRetryButtonClick}>다시 찾기</button>
            </div>
          </div>
        ) :
        appStage === APP_STAGE_MATCH_PREPARATION || appStage === APP_STAGE_MATCH_PROBLEM_FETCHED || appStage === APP_STAGE_ACCEPT_MATCH_INVITATION || appStage === APP_STAGE_USER_GIVE_UP_MATCH ? (
          <span className="subtitle is-small">{modalMessage}</span>
        ) :
        appStage === APP_STAGE_MATCH_END ? (
          <div className="columns is-multiline match-modal match-end">
            <div className="column is-half match-modal match-end">
            <div className="subtitle is-danger is-small match-modal match-end has-text-danger">{matchResult.winner.user_name} Win!</div>
            </div>
            <div className="column is-half match-modal match-end">
            <div className="subtitle is-small match-modal match-end loser-title">{matchResult.loser.user_name} Lose!</div>
            </div>
            <div className="column is-half match-modal match-end">
            <Link onClick={this.handleOnCloseButtonClick} className="button is-fullwidth is-small is-white match-modal match-end" to="/">메인으로</Link>
            </div>
            <div className="column is-half match-modal match-end">
            <Link onClick={this.handleOnCloseButtonClick} className="button is-fullwidth is-small is-danger match-modal match-end" to={`/users/${user._id}/matches`}>지난 전투 보기</Link>
            </div>
          </div>
        ) :
        appStage === APP_STAGE_MATCH_SUSPENDED ? (
          <div className="columns is-multiline match-modal match-end">
            <div className="column is-full">
            <span>
              {modalMessage}
            </span>
            </div>
            <div className="column is-half match-modal match-end">
            <Link onClick={this.handleOnCloseButtonClick} className="button is-fullwidth is-small is-white match-modal match-end" to="/">메인으로</Link>
            </div>
            <div className="column is-half match-modal match-end">
            <Link onClick={this.handleOnCloseButtonClick} className="button is-fullwidth is-small is-danger match-modal match-end" to={`/users/${user._id}/matches`}>지난 전투 보기</Link>
            </div>
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
