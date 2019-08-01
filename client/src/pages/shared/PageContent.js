import React from "react";

import InternalErrorPage from "../500Page";

import "../styles/PageContentStyles.css";

class PageContent extends React.Component {
  state = {
    hasError: false
  };

  componentDidCatch(err, info) {
    this.setState({ hasError: true });
  }

  render() {
    return (
      <div className="PageContent">
        {this.state.hasError ? <InternalErrorPage /> : this.props.children}
      </div>
    );
  }
}

export default PageContent;
