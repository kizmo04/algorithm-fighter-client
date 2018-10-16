import React, { Component, Fragment } from 'react';

class CombatMatch extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyDown (e) {
    console.log('key press value: ', e.key);

    this.props.emitKeyDownEvent();
  }

  handleKeyUp () {
    this.props.emitKeyUpEvent();
  }
  render() {
    const { user, matchPartner, isMatchPartnerKeyPress, matchMessage } = this.props;
    const { description, title } = this.props.problem;
    return (
        <Fragment>
          <h2>나</h2>
          <h3>{ user.email }</h3>
          <h2>상대</h2>
          <h3>{ matchPartner.email }</h3>
          <span>{ isMatchPartnerKeyPress ? matchMessage : '' }</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <textarea onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}></textarea>
        </Fragment>
    );
  }
}

export default CombatMatch;
