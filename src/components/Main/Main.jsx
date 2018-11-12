import React, { Component } from "react";
import "./Main.scss";

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    const { token, onBattleButtonClick } = this.props;
    onBattleButtonClick(token);
  }

  render() {
    return (
      <section className="hero is-large is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title main-title">Algorithm Fighter</h1>
            <h2 className="subtitle main-subtitle">
              Who will be the next algorithm champion?
            </h2>
            <button
              onClick={this.handleOnClick}
              className="button is-outlined is-large is-danger is-bold"
            >
              GO Fight!
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default Main;
