import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { readXY } from "./../adapters/github/views/pull";
import SectionHeader from "./common/Section";
import ExpandedCode from "./common/ExpandedCode";
import CodeNode from "./common/CodeNode";
import Docstring from "./common/Docstring";
import { API } from "./../utils/api";
import "./Definitions.css";
import * as SessionUtils from "../utils/session";

class DefinitionItem extends React.Component {
  state = {
    isHovering: false
  };

  handleMouseHover = () => {
    this.setState({
      isHovering: !this.state.isHovering
    });
  };

  getTop = () => {
    return this.refs.container.getBoundingClientRect().top;
  };

  render() {
    return (
      <div
        className="definition-item"
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
        ref={"container"}
      >
        <CodeNode name={this.props.name} file={this.props.filePath}>
          <div className="definition-docstring">
            {this.props.docstring
              ? Docstring(atob(this.props.docstring))
              : "docstring goes here"}
          </div>
        </CodeNode>

        {this.state.isHovering ? (
          <ExpandedCode
            codeBase64={this.props.codeSnippet}
            top={this.getTop()}
            startLine={this.props.lineNumber}
            filepath={this.props.filePath}
          />
        ) : null}
      </div>
    );
  }
}

class Definitions extends React.Component {
  // This gets x and y of the selected text, constructs the
  // API call payload by reading DOM, and then display the
  // result of the API call.
  static propTypes = {
    selectionX: PropTypes.number,
    selectionY: PropTypes.number
  };

  state = {
    isVisible: false,
    definition: {}
  };

  toggleVisibility = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.isVisible !== this.state.isVisible) {
      this.setState({ isVisible: newProps.isVisible });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.selectionX !== this.props.selectionX ||
      prevProps.selectionY !== this.props.selectionY
    ) {
      this.getSelectionData();
    }
  }

  getSelectionData = () => {
    // Assumes PR view and gets file name, line number etc
    // from selection x and y
    const hoverResult = readXY(this.props.selectionX, this.props.selectionY);

    const isValidResult =
      hoverResult.hasOwnProperty("fileSha") &&
      hoverResult.hasOwnProperty("lineNumber");

    if (isValidResult) {
      API.getDefinition(
        SessionUtils.getCurrentSessionId(this.props.storage.sessions),
        hoverResult.fileSha,
        hoverResult.filePath,
        hoverResult.lineNumber,
        hoverResult.charNumber
      )
        .then(response => {
          const definition = {
            name: response.result.name,
            filePath: response.result.definition.location.path,
            lineNumber: response.result.definition.location.range.start.line,
            docstring: response.result.docstring,
            codeSnippet: response.result.definition.contents
          };
          this.setState({ definition: definition });
        })
        .catch(error => {
          console.log("Error in API call", error);
        });
    }
  };

  componentDidMount = () => {
    // We have props, so we will make an API call to get data
    this.getSelectionData();
  };

  render() {
    return (
      <div className="definitions-section">
        <SectionHeader
          onClick={this.toggleVisibility}
          isVisible={this.state.isVisible}
          name={"Definitions"}
        />
        {this.state.isVisible ? (
          <DefinitionItem {...this.state.definition} />
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { storage, data } = state;
  return {
    storage,
    data
  };
}
export default connect(mapStateToProps)(Definitions);
