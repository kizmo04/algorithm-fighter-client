import React, { Component, Fragment } from 'react';
import { Controlled as CodeMirror } from "react-codemirror2";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/theme/tomorrow-night-bright.css";
import "../../../node_modules/codemirror/mode/xml/xml";
import "../../../node_modules/codemirror/mode/javascript/javascript";
import "./CombatMatch.scss";

class CombatMatch extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  handleKeyDown (editor, e) {
    this.props.emitKeyDownEvent();
  }

  handleKeyUp (editor, e) {
    this.props.emitKeyUpEvent();
  }

  handleClickSubmit (e) {
    const { user, problem, token, onSubmitButtonClick, code, combatRoomKey } = this.props;
    console.log('click submit')
    onSubmitButtonClick(user._id, code, problem._id, token, combatRoomKey);
  }
  render() {
    const { isFetching, matchPartner, isMatchPartnerKeyPress, matchMessage, code, changeCode, matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll, countPassed, testResult, matchTime } = this.props;
    const { description, title } = this.props.problem;
    const { profileImageUrl, email } = this.props.user;
    const options = {
      mode: "javascript",
      theme: "tomorrow-night-bright",
      lineNumbers: true,
      lineWrapping: true
    };
    const matchPartnerGauge = matchPartnerCountPassed ? Math.round(matchPartnerCountPassed / matchPartnerTestResult.length * 100) : 0;
    const userGauge = countPassed ? Math.round(countPassed / testResult.length * 100) : 0;
    console.log(userGauge)
    return (
      <Fragment>
        <div className="columns">
          <div className="column is-full user-status-bar">
            <div className="columns is-2">
              <div className="column is-two-fifths user-status-box">
                <figure className={`image is-64x64 user-profile ${ isMatchPartnerKeyPress ? 'blinking' : '' }`}>
                  <img className="is-rounded" src={matchPartner.profileImageUrl} alt="" />
                </figure>
                <h3 className={`title is-size-3 user-email ${ isMatchPartnerKeyPress ? 'blinking' : '' }`}>{ matchPartner.email }</h3>
                <progress class={`progress is-danger is-large ${ isMatchPartnerKeyPress ? 'blinking' : '' }`} value={matchPartnerGauge} max="100"></progress>
                <span className="subtitle is-size-3">{matchPartnerGauge}%</span>
              </div>
              <div className="column is-one-fifths">
                <h3>상대가 테스트를 { Math.ceil(matchPartnerCountPassed) }개 통과했습니다.</h3>
                <span>{matchTime}</span>
              </div>
              <div className="column is-two-fifths user-status-box">
                <h3 className="title is-size-3 user-email">{ email }</h3>
                <figure className="image is-64x64 user-profile">
                  <img className="is-rounded" src={profileImageUrl} alt="" />
                </figure>
                <progress class="progress is-info is-large user-gauge" value={userGauge} max="100"></progress>
                <span className="subtitle is-size-3">{userGauge}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="columns is-2">
          <div className="column is-half">
            <h2 className="title">{title}</h2>
            <p className="subtitle">{description}</p>
          </div>
          <div className="column is-half">
            <CodeMirror options={options} value={code} onBeforeChange={changeCode} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} />
            <button onClick={this.handleClickSubmit} className={`button is-danger is-large ${isFetching ? 'is-loading' : ''}`} type="submit">Attack!</button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CombatMatch;
