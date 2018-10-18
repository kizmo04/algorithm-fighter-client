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

    if (appStage === APP_STAGE_MATCH_END && !isFetching) {
      console.log(matchResult.winner_id === user._id ? user.userName : matchPartner.userName)
    }
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
            <div className="column is-two-third">
              <figure className="image is-64x64 user-profile">
                <img className="is-rounded" src={matchPartner.profileImageUrl} alt="" />
              </figure>
              <span className="subtitle is-small">{matchPartner.userName}의 결투신청</span>
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
        appStage === APP_STAGE_MATCH_PREPARATION || APP_STAGE_MATCH_PROBLEM_FETCHED ? (
        <span className="subtitle is-small">{modalMessage}</span>
        ) :
        appStage === APP_STAGE_MATCH_END && !isFetching ? (
          <div>
            <span className="subtitle is-small">{matchResult.winner_id === user._id ? user.userName : matchPartner.userName} Win</span>
            <span className="subtitle is-small">{matchResult.winner_id === user._id ? user.userName : matchPartner.userName} Lose</span>
            <Link className="button is-small is-white" to="/">메인으로</Link>
            <Link className="button is-small is-danger" to={`/users/${user._id}/matches`}>지난 전투 보기</Link>
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
