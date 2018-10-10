import React, { Component } from 'react';

class Auth extends Component {
  handlOnClick(e) {
    e.preventDefault();
    this.props.authenticateUser();
  }
  render() {
    return (
      <section className="section">
        <div className="container">
          <button className="button" onClick={this.handlOnClick.bind(this)}>Github Log In</button>
        </div>
      </section>
    );
  }
}

export default Auth;
