import React, { Component, Fragment } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import MarkDown from "react-markdown";
import { toMatchTimeFormatString } from "../../lib/date";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/theme/tomorrow-night-bright.css";
import "../../../node_modules/codemirror/mode/xml/xml";
import "../../../node_modules/codemirror/mode/javascript/javascript";
import "./CombatMatch.scss";

class CombatMatch extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
    this.timeOutId = null;
    this.handleOnSurrenderButtonClick = this.handleOnSurrenderButtonClick.bind(
      this
    );
  }

  componentDidUpdate(prevProps) {
    const { isPassedAll, onDidUpdate, token, user, matchId } = this.props;
    if (!prevProps.isPassedAll && isPassedAll) {
      onDidUpdate(token, user._id, matchId);
    }
  }

  handleKeyDown(editor, e) {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId);
    }
    this.timeOutId = setTimeout(() => {
      this.props.emitKeyUpEvent();
    }, 500);
    this.props.emitKeyDownEvent();
  }

  handleOnSurrenderButtonClick() {
    const { onSurrenderButtonClick } = this.props;
    onSurrenderButtonClick();
  }

  handleClickSubmit(e) {
    const {
      user,
      problem,
      token,
      onSubmitButtonClick,
      code,
      combatRoomKey
    } = this.props;
    onSubmitButtonClick(user._id, code, problem._id, token, combatRoomKey);
  }
  render() {
    const {
      isFetching,
      matchPartner,
      isMatchPartnerKeyPress,
      matchMessage,
      code,
      changeCode,
      matchPartnerTestResult,
      matchPartnerCountPassed,
      matchPartnerIsPassedAll,
      isPassedAll,
      countPassed,
      testResult,
      matchTime
    } = this.props;
    const { description, title } = this.props.problem;
    const { profileImageUrl, email, userName } = this.props.user;
    const options = {
      mode: "javascript",
      theme: "tomorrow-night-bright",
      lineNumbers: true,
      lineWrapping: true
    };
    const matchPartnerGauge = matchPartnerCountPassed
      ? Math.round(
          (matchPartnerCountPassed / matchPartnerTestResult.length) * 100
        )
      : 0;
    const userGauge = countPassed
      ? Math.round((countPassed / testResult.length) * 100)
      : 0;
    var i = 0;
    return (
      <Fragment>
        <div className="columns">
          <div className="column is-full user-status-bar">
            <div className="columns is-2">
              <div className="column is-two-fifths user-status-box">
                <figure className="image is-48x48 user-profile-image combat-match-user-status partner">
                  <img className="" src={matchPartner.profileImageUrl} alt="" />
                </figure>
                <h3
                  className={`button is-info is-medium user-username ${
                    matchPartnerIsPassedAll ? "" : "is-outlined is-win"
                  }`}
                >
                  {matchPartner.userName}
                  <div id={`${isMatchPartnerKeyPress ? "wave" : ""}`}>
                    <span class="dot" />
                    <span class="dot" />
                    <span class="dot" />
                  </div>
                </h3>
                <progress
                  class={"progress is-info is-small"}
                  value={matchPartnerGauge}
                  max="100"
                />
                <span className="partner-gauge-percent has-text-info">
                  {matchPartnerGauge}%
                </span>
              </div>
              <div className="column is-one-fifths">
                <i class="material-icons clock">schedule</i>
                <p className="subtitle is-large">
                  {toMatchTimeFormatString(matchTime)} left
                </p>
              </div>
              <div className="column is-two-fifths user-status-box">
                <figure className="image is-48x48 user-profile-image combat-match-user-status">
                  <img className="" src={profileImageUrl} alt="" />
                </figure>
                <h3
                  className={`button is-danger is-medium user-username ${
                    isPassedAll ? "" : "is-outlined is-win"
                  }`}
                >
                  {userName}
                </h3>
                <progress
                  class="progress is-danger is-small user-gauge"
                  value={userGauge}
                  max="100"
                />
                <span className="user-gauge-percent has-text-danger">
                  {userGauge}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="columns is-2">
          <div className="column is-half">
            <h2 className="title">{title}</h2>
            <MarkDown className="markdown" source={description} />
          </div>
          <div className="column is-half">
            <CodeMirror
              options={options}
              value={code}
              onBeforeChange={changeCode}
              onKeyDown={this.handleKeyDown}
            />
            <div className="columns">
              <div className="column is-half">
                <button
                  onClick={this.handleOnSurrenderButtonClick}
                  className={`button is-fullwidth is-info is-outlined is-medium ${
                    isFetching ? "is-loading" : ""
                  }`}
                  type="submit"
                >
                  Surrender
                </button>
              </div>
              <div className="column is-half">
                <button
                  onClick={this.handleClickSubmit}
                  className={`button is-fullwidth is-danger is-outlined is-medium ${
                    isFetching ? "is-loading" : ""
                  }`}
                  type="submit"
                >
                  Attack!
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CombatMatch;
