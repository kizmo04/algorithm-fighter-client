import React, { Component, Fragment } from 'react';

class CombatMatch extends Component {
  render() {
    const { user, matchPartner } = this.props;
    const { description, title } = this.props.problem;
    return (
        <Fragment>
          <h2>나</h2>
          <h3>{ user.email }</h3>
          <h2>상대</h2>
          <h3>{ matchPartner.email }</h3>
          <h2>{title}</h2>
          <p>{description}</p>
        </Fragment>
    );
  }
}

export default CombatMatch;
