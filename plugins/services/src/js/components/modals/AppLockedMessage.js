/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import Pod from "../../structs/Pod";
import ServiceTree from "../../structs/ServiceTree";

const AppLockedMessage = function({ service }) {
  let itemType = "服务";

  if (service instanceof Pod) {
    itemType = "Pod";
  }

  if (service instanceof ServiceTree) {
    itemType = "分组";
  }

  return (
    <h4 className="text-align-center text-danger flush-top">
      {itemType}
      {" "}
      当前已被一个或多个部署动作锁定. 再次点击按钮将会强制全量部署配置的变动.
    </h4>
  );
};

module.exports = AppLockedMessage;
