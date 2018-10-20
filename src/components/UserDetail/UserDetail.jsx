import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import UserMatchList from '../UserMatchList/UserMatchList';
import UserSolutionList from '../UserSolutionList/UserSolutionList';
import './UserDetail.scss';

class UserDetail extends Component {
  render() {
    const { user, token, solutionList, fetchUserPastSolutions, fetchUserPastMatchResult, matchResultList, pathName, expandedAccordionIndex, expandAccordion, collapseAccordion } = this.props;
    const { profileImageUrl, userName, email, name, shortBio, createdAt, isFetching } = this.props.user;
    return (
      <div className="columns is-multiline">
        <div className="column is-full">
          <h2 className="title is-small">Hi, {user.name || userName}</h2>
          <figure className="image is-64x64 user-detail-profile user-info-image">
            <img className="is-rounded" src={profileImageUrl} alt="" />
          </figure>
          <div className="subtitle is-small">{userName || user.name}</div>
          <div className="subtitle is-small">{shortBio}</div>
        </div>
        <div className="column is-full">
          <div className="user-detail-menu tabs is-fullwidth is-small">
            <ul>
              <li className={`${pathName.includes('matches') ? 'is-active' : ''}`}>
                <Link className="tab-menu" to={`/users/${user._id}/matches`}>
                  <span class="icon"><i class="fas fa-angle-left" aria-hidden="true"></i></span>
                  <span>Past Match Results</span>
                </Link>
              </li>
              <li className={`${pathName.includes('solutions') ? 'is-active' : ''}`}>
                <Link className="tab-menu" to={`/users/${user._id}/solutions`}>
                  <span>Past Solutions</span>
                  <span class="icon"><i class="fas fa-angle-right" aria-hidden="true"></i></span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="container">
            <Switch>
              <Route path={'/users/:user_id/matches'} render={() => {
                console.log('match list render')
                return <UserMatchList isFetching={isFetching} user={user} token={token} onDidMount={fetchUserPastMatchResult} matches={matchResultList} />;
              }} />
              <Route path={'/users/:user_id/solutions'} render={() => {
                return <UserSolutionList isFetching={isFetching} expandAccordion={expandAccordion} collapseAccordion={collapseAccordion} expandedAccordionIndex={expandedAccordionIndex} user={user} token={token} onDidMount={fetchUserPastSolutions} solutions={solutionList} />;
              }} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetail;
