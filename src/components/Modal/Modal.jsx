import React, { Component } from "react";
import "./Modal.scss";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleOnCloseButtonClick = this.handleOnCloseButtonClick.bind(this);
  }

  handleOnCloseButtonClick() {
    this.props.onCloseButtonClick();
  }
  render() {
    const { isActive } = this.props;
    return (
      <section className="section is-medium">
        <div className="container">
          <div className={`modal ${isActive ? "is-active" : ""}`}>
            <div className="modal-background"></div>
              <div className="modal-content">
                {
                  this.props.children
                }
              </div>
            <button
              onClick={this.handleOnCloseButtonClick}
              className="modal-close is-large"
              aria-label="close"
            />
          </div>
        </div>
      </section>
    );
  }
}

export default Modal;
