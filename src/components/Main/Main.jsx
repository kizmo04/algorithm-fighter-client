import React, { Component } from "react";

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  handleOnClick(){
  }
  render() {
    return (
      <section className="hero is-large is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <button className="button is-large is-danger is-bold" onClick={this.handleOnClick}>Battle</button>
            <h1 className="title">Code Battle</h1>
            <h2 className="subtitle">Primary bold subtitle</h2>
          </div>
        </div>
      </section>
    );
  }
}

export default Main;
