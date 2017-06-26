import React from "react";

import Icon from "../../../../../src/js/components/Icon";

class NodesPage extends React.Component {
  render() {
    return this.props.children;
  }
}

NodesPage.routeConfig = {
  label: "节点",
  icon: <Icon id="servers-inverse" size="small" family="product" />,
  matches: /^\/nodes/
};

module.exports = NodesPage;
