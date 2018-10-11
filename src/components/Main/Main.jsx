import React, { Component } from "react";

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  handleOnClick(){
    if (!Object.keys(this.props.user).length) {
      // 로그인 안내
    } else {
      this.props.onBattleButtonClick(this.props.user);
    }
  }
  render() {
    return (
      <section className="hero is-large is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <button onClick={this.handleOnClick} className="button is-large is-danger is-bold">Combat Start!</button>
            <h1 className="title">Code Battle</h1>
            <h2 className="subtitle">Primary bold subtitle</h2>
          </div>
        </div>
      </section>
    );
  }
}

export default Main;
