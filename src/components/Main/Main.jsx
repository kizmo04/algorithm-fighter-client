import React, { Component } from "react";
import './Main.scss';
// import { sendResponseGuestUserInfo } from '../../lib/socket';

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  componentDidMount() {
    // sendResponseGuestUserInfo(this.props.user);
  }

  componentWillUnmount() {

  }
  handleOnClick(){
    this.props.onBattleButtonClick(this.props.user);
  }
  render() {
    return (
      <section className="hero is-large is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title main-title">Algorithm Fighter</h1>
            <button onClick={this.handleOnClick} className="button is-large is-danger is-bold">al-fa GO!</button>
            <h2 className="subtitle main-subtitle">Who will be the next algorithm champion?</h2>
          </div>
        </div>
      </section>
    );
  }
}

export default Main;
