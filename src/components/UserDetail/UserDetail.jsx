import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import UserMatchList from '../UserMatchList/UserMatchList';
import UserSolutionList from '../UserSolutionList/UserSolutionList';

class UserDetail extends Component {
  render() {
    const { user, token, solutionList, fetchUserPastSolutions, fetchUserPastMatchResult, matchResultList, pathName, expandedAccordionIndex, expandAccordion } = this.props;
    const { profileImageUrl, userName, email, name, shortBio, createdAt } = this.props.user;
    return (
      <div className="columns is-multiline">
        <div className="column is-full">
          <h2 className="title is-small">Hi, {user.name}</h2>
          <figure className="image is-64x64 user-profile">
            <img className="is-rounded" src={profileImageUrl} alt="" />
          </figure>
          <div className="title">{userName}</div>
          <div className="">{email}</div>
          <div className="title">{name}</div>
          <div className="title">{shortBio}</div>
          <div className="title">{createdAt}</div>
        </div>
        <div className="column is-full">
          <div className="tabs is-fullwidth is-small">
            <ul>
              <li className={`${pathName.includes('matches') ? 'is-active' : ''}`}>
                <Link to={`/users/${user._id}/matches`}>
                  <span class="icon"><i class="fas fa-angle-left" aria-hidden="true"></i></span>
                  <span>Past Match Results</span>
                </Link>
              </li>
              <li className={`${pathName.includes('solutions') ? 'is-active' : ''}`}>
                <Link to={`/users/${user._id}/solutions`}>
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
                return <UserMatchList user={user} token={token} onDidMount={fetchUserPastMatchResult} matches={matchResultList} />;
              }} />
              <Route path={'/users/:user_id/solutions'} render={() => {
                return <UserSolutionList expandAccordion={expandAccordion} expandedAccordionIndex={expandedAccordionIndex} user={user} token={token} onDidMount={fetchUserPastSolutions} solutions={solutionList} />;
              }} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetail;
