import React, { Component, Fragment } from 'react';
import { Controlled as CodeMirror } from "react-codemirror2";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/theme/tomorrow-night-bright.css";
import "../../../node_modules/codemirror/mode/xml/xml";
import "../../../node_modules/codemirror/mode/javascript/javascript";
import "./UserSolutionList.scss";

class UserSolutionList extends Component {
  constructor(props) {
    super(props);
    this.isExpanded = React.createRef();
  }
  componentDidMount() {
    const { user, token, onDidMount } = this.props;
    onDidMount(user._id, token);
  }

  handleOnClick(e) {
    this.props.expandAccordion(e.target.dataset.index); 
  }
  render() {
    const options = {
      mode: "javascript",
      theme: "tomorrow-night-bright",
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      readOnly: true,
    };
    const { solutions, expandedAccordionIndex } = this.props;
    return (
      <Fragment>
        {
          solutions.map((solution, i) => (
            <div className="columns">
              <div className="column is-one-quarter"></div>
              <div className="column is-half">
                <div key={i} className="box solution">
                  <ul>
                    <li className="entry">
                      <p className="subtitle is-small entry-title" data-index={i} onClick={this.handleOnClick.bind(this)} ref={this.isExpanded}>{solution.problem_title}</p>
                      <ul className={`entry-content ${parseInt(expandedAccordionIndex) === i ? 'is-expand' : ''}`}>
                        <li className="created-at">
                          <p className="subtitle is-small">submitted at: {solution.created_at}</p>
                        </li>
                        <li className="code">
                          <CodeMirror options={options} value={solution.code} />
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="column is-one-quarter"></div>
            </div>
          ))
        }
      </Fragment>
    );
  }
}

export default UserSolutionList;
