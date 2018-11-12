import React, { Component, Fragment } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { toNewFormatString } from "../../lib/date";
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

  toggleAccordion(e) {
    const {
      expandAccordion,
      collapseAccordion,
      expandedAccordionIndex
    } = this.props;
    const index = parseInt(e.target.dataset.index);
    if (expandedAccordionIndex === index) {
      collapseAccordion();
    } else {
      expandAccordion(index);
    }
  }

  render() {
    const options = {
      mode: "javascript",
      theme: "tomorrow-night-bright",
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      autoRefresh: true,
      readOnly: true
    };
    const { solutions, expandedAccordionIndex, isFetching } = this.props;

    return (
      <Fragment>
        {!isFetching ? (
          solutions.map((solution, i) => (
            <div className="columns">
              <div className="column" />
              <div className="column is-10">
                <div key={i} className="box solution-box">
                  <ul>
                    <li className="entry">
                      <div className="columns entry-header">
                        <div className="column is-two-third">
                          <p
                            className="subtitle is-small entry-title"
                            data-index={i}
                            onClick={this.toggleAccordion.bind(this)}
                            ref={this.isExpanded}
                          >
                            {solution.problem_title}
                          </p>
                        </div>
                        <div className="column is-one-third">
                          <p className="subtitle is-small">
                            {toNewFormatString(solution.created_at)}
                          </p>
                        </div>
                      </div>
                      <ul
                        className={`entry-content ${
                          parseInt(expandedAccordionIndex) === i
                            ? "is-expand"
                            : ""
                        }`}
                      >
                        <li className="code">
                          <CodeMirror
                            options={options}
                            value={solution.code}
                            editorDidMount={editor => {
                              editor.refresh();
                            }}
                          />
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="column" />
            </div>
          ))
        ) : (
          <div className="spinner" />
        )}
      </Fragment>
    );
  }
}

export default UserSolutionList;
