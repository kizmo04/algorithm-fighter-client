import React, { Component, Fragment } from 'react';
import { Controlled as CodeMirror } from "react-codemirror2";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/theme/tomorrow-night-bright.css";
import "../../../node_modules/codemirror/mode/xml/xml";
import "../../../node_modules/codemirror/mode/javascript/javascript";

class CombatMatch extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  handleKeyDown (editor, e) {
    console.log('key press value: ', e.key);

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
    const { user, matchPartner, isMatchPartnerKeyPress, matchMessage, code, changeCode, matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll } = this.props;
    const { description, title } = this.props.problem;
    const options = {
      mode: "javascript",
      theme: "tomorrow-night-bright",
      lineNumbers: true,
      lineWrapping: true
    };
    return (
        <Fragment>
          <h2>나</h2>
          <h3>{ user.email }</h3>
          <h2>상대</h2>
          <h3>{ matchPartner.email }</h3>
          <h3>상대가 테스트를 { matchPartnerCountPassed }개 통과했습니다.</h3>
          <span>{ isMatchPartnerKeyPress ? matchMessage : '' }</span>
          <h2>{title}</h2>
          <p>{description}</p>
          
            {/* <textarea className="textarea is-danger is-normal" rows="50" value={initial_code} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}></textarea> */}
            <CodeMirror options={options} value={code} onBeforeChange={changeCode} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} />
            <button onClick={this.handleClickSubmit} className="button is-danger is-large" type="submit">Attack!</button>

        </Fragment>
    );
  }
}

export default CombatMatch;
