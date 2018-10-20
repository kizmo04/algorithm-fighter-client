import React, { Component, Fragment } from 'react';
import { toNewFormatString } from '../../lib/date';

class UserMatchList extends Component {
  componentDidMount() {
    const { onDidMount, user, token } = this.props;
    onDidMount(user._id, token);
  }
  render() {
    const { matches, user, isFetching } = this.props;

    return (
      <div className="columns">
        <div className="column is-one-fifth"></div>
        <div className="column">
        {  matches.length ? <div className="timeline is-centered">
            <header className="timeline-header">
              <span className="tag is-medium is-danger">Joined at {toNewFormatString(user.createdAt)}</span>
            </header>
        {
          matches ? matches.map((match, i) => {
            return (
              <Fragment>
                <div className="timeline-item is-danger">
                  <div className="timeline-marker is-danger"></div>
                  <div className="timeline-content">
                    <p className="heading">{toNewFormatString(match.created_at)}</p>
                    <p>{match.winner === user.email ? `YOU beat ${match.partner}` : `${match.partner} beat YOU`}</p>
                  </div>
                </div>
                {
                  i < matches.length -1 && Number(match.created_at.split('-')[0]) < Number(matches[i + 1].created_at.split('-')[0]) ?
                  <header class="timeline-header">
                    <span class="tag is-danger">{matches[i + 1].created_at.split('-')[0]}</span>
                  </header>
                  : null
                }
              </Fragment>
            );
          }
            ) : <div className="spinner"></div>
          }
          <header class="timeline-header">
            <span class="tag is-medium is-link">{toNewFormatString(new Date().toISOString())}</span>
          </header>
          </div>
          : <div className="spinner"></div>}
        </div>
        <div className="column is-one-fifth"></div>
      </div>
    );
  }
}

export default UserMatchList;
