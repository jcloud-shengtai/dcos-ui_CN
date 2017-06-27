import React, { PropTypes } from "react";

import AlertPanel from "../../../../../../src/js/components/AlertPanel";
import AlertPanelHeader
  from "../../../../../../src/js/components/AlertPanelHeader";

const EmptyServiceTree = function({ onCreateGroup, onCreateService }) {
  const footer = (
    <div className="button-collection flush-bottom">
      <button className="button button-stroke" onClick={onCreateGroup}>
        创建组
      </button>
      <button className="button button-success" onClick={onCreateService}>
        运行服务
      </button>
    </div>
  );

  return (
    <AlertPanel>
      <AlertPanelHeader>No running services</AlertPanelHeader>
      <p className="tall">
        运行一个新的服务或者创建一个分组来帮助你规划组织你的服务.
      </p>
      {footer}
    </AlertPanel>
  );
};

EmptyServiceTree.defaultProps = {
  onCreateGroup: () => {},
  onCreateService: () => {}
};

EmptyServiceTree.propTypes = {
  onCreateGroup: PropTypes.func,
  onCreateService: PropTypes.func
};

module.exports = EmptyServiceTree;
