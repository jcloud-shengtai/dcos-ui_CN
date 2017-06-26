import { isEmpty } from "../../../../../src/js/utils/ValidatorUtil";
import ServiceConfigUtil from "../utils/ServiceConfigUtil";
import NetworkValidatorUtil
  from "../../../../../src/js/utils/NetworkValidatorUtil";
import { findNestedPropertyInObject } from "../../../../../src/js/utils/Util";
import {
  VIP_LABEL_VALUE_REGEX
} from "../../../../../src/js/constants/Networking";

function checkServiceEndpoints(ports, pathPrefix) {
  return ports.reduce(function(portsMemo, port, index) {
    const labels = port.labels || {};
    const vipLabels = Object.keys(labels).filter(
      ServiceConfigUtil.matchVIPLabel
    );

    const errors = vipLabels.reduce(function(errorsMemo, label) {
      const vipLabelMatch = VIP_LABEL_VALUE_REGEX.exec(labels[label]);

      if (!vipLabelMatch) {
        return errorsMemo.concat({
          path: pathPrefix.concat([index, "labels", label]),
          message: "VIP 标签必须使用如下格式: <ip-addres|name>:<port>"
        });
      }

      const vipPort = vipLabelMatch[2];

      if (!NetworkValidatorUtil.isValidPort(vipPort)) {
        return errorsMemo.concat({
          path: pathPrefix.concat([index, "labels", label]),
          message: "端口号必须为不大于 65535 的正整数"
        });
      }

      return errorsMemo;
    }, []);

    return portsMemo.concat(errors);
  }, []);
}

const VipLabelsValidators = {
  mustContainPort(app) {
    // Single container app with HOST network
    let ports = findNestedPropertyInObject(app, "portDefinitions");
    let pathPrefix = ["portDefinitions"];

    // Single container app with BRIDGE or USER network
    if (isEmpty(ports)) {
      ports = findNestedPropertyInObject(app, "container.docker.portMappings");
      pathPrefix = ["container", "docker", "portMappings"];
    }

    if (!isEmpty(ports)) {
      return checkServiceEndpoints(ports, pathPrefix);
    }

    // Multi container app
    const containers = app.containers || [];

    return containers.reduce(function(
      memo,
      { endpoints = [] },
      containerIndex
    ) {
      pathPrefix = ["containers", containerIndex, "endpoints"];

      return memo.concat(checkServiceEndpoints(endpoints, pathPrefix));
    }, []);
  }
};

module.exports = VipLabelsValidators;
