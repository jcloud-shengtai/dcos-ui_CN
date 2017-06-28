import React from "react";
import { Table } from "reactjs-components";

import ConfigurationMapEditAction
  from "../components/ConfigurationMapEditAction";
import ContainerConstants from "../constants/ContainerConstants";
import ServiceConfigBaseSectionDisplay from "./ServiceConfigBaseSectionDisplay";
import { findNestedPropertyInObject } from "../../../../../src/js/utils/Util";
import { formatResource } from "../../../../../src/js/utils/Units";
import {
  getColumnClassNameFn,
  getColumnHeadingFn,
  getDisplayValue
} from "../utils/ServiceConfigDisplayUtil";

const { type: { DOCKER, NONE }, labelMap } = ContainerConstants;

class ServiceGeneralConfigSection extends ServiceConfigBaseSectionDisplay {
  /**
   * @override
   */
  shouldExcludeItem(row) {
    const { appConfig } = this.props;

    switch (row.key) {
      case "fetch":
        return !findNestedPropertyInObject(appConfig, "fetch.length");
      case "gpus":
        return !findNestedPropertyInObject(appConfig, "gpus");
      case "backoffSeconds":
        return !findNestedPropertyInObject(appConfig, "backoffSeconds");
      case "backoffFactor":
        return !findNestedPropertyInObject(appConfig, "backoffFactor");
      case "maxLaunchDelaySeconds":
        return !findNestedPropertyInObject(appConfig, "maxLaunchDelaySeconds");
      case "minHealthOpacity":
        return !findNestedPropertyInObject(appConfig, "minHealthOpacity");
      case "maxOverCapacity":
        return !findNestedPropertyInObject(appConfig, "maxOverCapacity");
      case "acceptedResourceRoles":
        return !findNestedPropertyInObject(
          appConfig,
          "acceptedResourceRoles.length"
        );
      case "dependencies":
        return !findNestedPropertyInObject(appConfig, "dependencies.length");
      case "executor":
        return !findNestedPropertyInObject(appConfig, "executor");
      case "user":
        return !findNestedPropertyInObject(appConfig, "user");
      case "args":
        return !findNestedPropertyInObject(appConfig, "args.length");
      case "version":
        return !findNestedPropertyInObject(appConfig, "version");
      default:
        return false;
    }
  }

  /**
   * @override
   */
  getDefinition() {
    const { onEditClick } = this.props;

    return {
      tabViewID: "services",
      values: [
        {
          heading: "概况",
          headingLevel: 1
        },
        {
          key: "id",
          label: "服务 ID"
        },
        {
          key: "instances",
          label: "实例"
        },
        {
          key: "container.type",
          label: "容器运行时环境",
          transformValue(runtime) {
            return labelMap[runtime] || labelMap[NONE];
          }
        },
        {
          key: "cpus",
          label: "CPU"
        },
        {
          key: "mem",
          label: "内存",
          transformValue(value) {
            if (value == null) {
              return value;
            }

            return formatResource("mem", value);
          }
        },
        {
          key: "disk",
          label: "硬盘",
          transformValue(value) {
            if (value == null) {
              return value;
            }

            return formatResource("disk", value);
          }
        },
        {
          key: "gpus",
          label: "GPU"
        },
        {
          key: "backoffSeconds",
          label: "Backoff Seconds"
        },
        {
          key: "backoffFactor",
          label: "Backoff 因素"
        },
        {
          key: "maxLaunchDelaySeconds",
          label: "Backoff 最大启动延迟"
        },
        {
          key: "minHealthOpacity",
          label: "升级最小健康度"
        },
        {
          key: "maxOverCapacity",
          label: "Upgrade Max Overcapacity"
        },
        {
          key: "container.docker.image",
          label: "容器镜像",
          transformValue(value, appConfig) {
            const runtime = findNestedPropertyInObject(
              appConfig,
              "container.type"
            );

            // Disabled for NONE
            return getDisplayValue(value, runtime == null || runtime === NONE);
          }
        },
        {
          key: "container.docker.privileged",
          label: "运行环境扩展权限.",
          transformValue(value, appConfig) {
            const runtime = findNestedPropertyInObject(
              appConfig,
              "container.type"
            );
            // Disabled for DOCKER
            if (runtime !== DOCKER && value == null) {
              return getDisplayValue(null, true);
            }

            // Cast boolean as a string.
            return String(Boolean(value));
          }
        },
        {
          key: "container.docker.forcePullImage",
          label: "启动时强制拉取",
          transformValue(value, appConfig) {
            const runtime = findNestedPropertyInObject(
              appConfig,
              "container.type"
            );
            // Disabled for DOCKER
            if (runtime !== DOCKER && value == null) {
              return getDisplayValue(null, true);
            }

            // Cast boolean as a string.
            return String(Boolean(value));
          }
        },
        {
          key: "cmd",
          label: "命令",
          type: "pre"
        },
        {
          key: "acceptedResourceRoles",
          label: "资源规则",
          transformValue(value = []) {
            return value.join(", ");
          }
        },
        {
          key: "dependencies",
          label: "依赖项",
          transformValue(value = []) {
            return value.join(", ");
          }
        },
        {
          key: "executor",
          label: "执行器"
        },
        {
          key: "user",
          label: "用户"
        },
        {
          key: "args",
          label: "参数",
          transformValue(value = []) {
            if (!value.length) {
              return getDisplayValue(null);
            }

            const args = value.map((arg, index) => (
              <pre key={index} className="flush transparent wrap">{arg}</pre>
            ));

            return <div>{args}</div>;
          }
        },
        {
          key: "version",
          label: "版本"
        },
        {
          key: "fetch",
          heading: "Container Artifacts",
          headingLevel: 3
        },
        {
          key: "fetch",
          render(data) {
            const columns = [
              {
                heading: getColumnHeadingFn("Artifact Uri"),
                prop: "uri",
                render: (prop, row) => {
                  const value = row[prop];

                  return getDisplayValue(value);
                },
                className: getColumnClassNameFn(
                  "configuration-map-table-label"
                ),
                sortable: true
              }
            ];

            if (onEditClick) {
              columns.push({
                heading() {
                  return null;
                },
                className: "configuration-map-action",
                prop: "edit",
                render() {
                  return (
                    <ConfigurationMapEditAction
                      onEditClick={onEditClick}
                      tabViewID="services"
                    />
                  );
                }
              });
            }

            return (
              <Table
                key="artifacts-table"
                className="table table-simple table-align-top table-break-word table-fixed-layout flush-bottom"
                columns={columns}
                data={data}
              />
            );
          }
        }
      ]
    };
  }
}

module.exports = ServiceGeneralConfigSection;
