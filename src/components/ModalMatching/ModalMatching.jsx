import React, { Component } from "react";

class ModalMatching extends Component {
  constructor(props) {
    super(props);
    this.handleAcceptButtonClick = this.handleAcceptButtonClick.bind(this);
    this.handleCancelButtonClick = this.handleCancelButtonClick.bind(this);
    this.handleRetryButtonClick = this.handleRetryButtonClick.bind(this);
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



  render() {
    const { message, stage, user } = this.props;
    return (
      <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title is-2 is-spaced">매칭 중</p>
        <button className="delete" aria-label="close"></button>
      </header>
      <section className="modal-card-body">
      {
        stage < 3 ? <span className="subtitle is-2">{message}</span> : 
        stage === 3 ? (
          <div>
            <img alt="" src={user.profileImageUrl}/>
            <span>{user.email}님과 대결하시겠습니까?</span>
            <button className="button is-small">전투시작</button>
          </div>
        ) :
        stage === 4 ? (
          <div>
            <span>{message}</span>
            <button className="button is-small" onClick={this.handleAcceptButtonClick}>수락</button>
            <button className="button is-small" onClick={this.handleCancelButtonClick}>거절</button>
          </div>
        ) :
        stage === 5 ? (
          <div>
            <span>{message}</span>
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

export default ModalMatching;
