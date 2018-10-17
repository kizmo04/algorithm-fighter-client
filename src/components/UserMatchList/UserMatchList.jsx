import React, { Component, Fragment } from 'react';

class UserMatchList extends Component {
  componentDidMount() {
    const { onDidMount, user, token } = this.props;
    onDidMount(user._id, token);
  }
  render() {
    const { matches, user } = this.props;
    return (
      <div className="columns">
        <div className="column is-one-quarter"></div>
        <div className="column is-half">
        {
          matches ? matches.map(match => (
            <div className="box">
              <div className="subtitle is-small">Fight with {match.partner} at {match.created_at}</div>
              <div className="subtitle is-small">{match.winner === user.email ? `YOU beat ${match.partner}` : `${match.partner} beat YOU`}</div>
              <div></div>
            </div>
          )) : null
        }
        </div>
        <div className="column is-one-quarter"></div>
      </div>
    );
  }
}

export default UserMatchList;
