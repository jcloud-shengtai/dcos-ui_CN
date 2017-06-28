import React from "react";

import ConfigurationMapTable from "../components/ConfigurationMapTable";
import ConfigurationMapDurationValue
  from "../components/ConfigurationMapDurationValue";
import ConfigurationMapHeading
  from "../../../../../src/js/components/ConfigurationMapHeading";
import ConfigurationMapSection
  from "../../../../../src/js/components/ConfigurationMapSection";
import { getContainerNameWithIcon } from "../utils/ServiceConfigDisplayUtil";
import ConfigurationMapValueWithDefault
  from "../components/ConfigurationMapValueWithDefault";

const COMMON_COLUMNS = [
  {
    heading: "Grace Period",
    prop: "gracePeriod",
    render(prop, row) {
      return <ConfigurationMapDurationValue units="sec" value={row[prop]} />;
    }
  },
  {
    heading: "间隔",
    prop: "interval",
    render(prop, row) {
      return <ConfigurationMapDurationValue units="sec" value={row[prop]} />;
    }
  },
  {
    heading: "超时",
    prop: "timeout",
    render(prop, row) {
      return <ConfigurationMapDurationValue units="sec" value={row[prop]} />;
    }
  },
  {
    heading: "最大失败次数",
    prop: "maxFailures"
  },
  {
    heading: "容器",
    prop: "container"
  }
];

class PodHealthChecksConfigSection extends React.Component {
  getCommandColumns() {
    return [
      {
        heading: "命令",
        prop: "command"
      }
    ].concat(COMMON_COLUMNS);
  }

  getDefaultEndpointsColumns() {
    return {
      hideIfEmpty: true,
      render(prop, row) {
        // We use a default <Value/> renderer in order to render
        // all elements as <Div/>s. Otherwise the boolean's look
        // funny.
        return <ConfigurationMapValueWithDefault value={row[prop]} />;
      }
    };
  }

  getEndpointsColumns() {
    return [
      {
        heading: "服务端点",
        prop: "endpoint"
      },
      {
        heading: "协议",
        prop: "protocol"
      },
      {
        heading: "路径",
        prop: "path"
      }
    ].concat(COMMON_COLUMNS);
  }

  render() {
    const { onEditClick } = this.props;
    const { containers = [] } = this.props.appConfig;
    const healthChecks = containers.reduce(
      (memo, container) => {
        const { healthCheck } = container;

        if (!healthCheck) {
          return memo;
        }

        const spec = {
          interval: healthCheck.intervalSeconds,
          gracePeriod: healthCheck.gracePeriodSeconds,
          maxFailures: healthCheck.maxConsecutiveFailures,
          timeout: healthCheck.timeoutSeconds,
          container: getContainerNameWithIcon(container)
        };

        if (healthCheck.exec != null) {
          spec.command = healthCheck.exec.command.shell;
          if (healthCheck.exec.command.argv) {
            spec.command = healthCheck.exec.command.argv.join(" ");
          }

          memo.command.push(spec);
        }

        if (healthCheck.http != null) {
          spec.endpoint = healthCheck.http.endpoint;
          spec.path = healthCheck.http.path;
          spec.protocol = healthCheck.http.scheme || "http";
          memo.endpoints.push(spec);
        }

        if (healthCheck.tcp != null) {
          spec.endpoint = healthCheck.tcp.endpoint;
          spec.protocol = "tcp";
          memo.endpoints.push(spec);
        }

        return memo;
      },
      { endpoints: [], command: [] }
    );

    if (!healthChecks.endpoints.length && !healthChecks.command.length) {
      return null;
    }

    return (
      <div>
        <ConfigurationMapHeading level={1}>
          健康检查
        </ConfigurationMapHeading>

        {healthChecks.endpoints.length !== 0 &&
          <div>
            <ConfigurationMapHeading level={2}>
              Service Endpoint Health Checks
            </ConfigurationMapHeading>
            <ConfigurationMapSection key="pod-general-section">
              <ConfigurationMapTable
                columnDefaults={this.getDefaultEndpointsColumns()}
                columns={this.getEndpointsColumns()}
                data={healthChecks.endpoints}
                onEditClick={onEditClick}
                tabViewID="multihealthChecks"
              />
            </ConfigurationMapSection>
          </div>}

        {healthChecks.command.length !== 0 &&
          <div>
            <ConfigurationMapHeading level={2}>
              命令健康检查
            </ConfigurationMapHeading>
            <ConfigurationMapSection key="pod-general-section">
              <ConfigurationMapTable
                columnDefaults={{ hideIfEmpty: true }}
                columns={this.getCommandColumns()}
                data={healthChecks.command}
                onEditClick={onEditClick}
                tabViewID="multihealthChecks"
              />
            </ConfigurationMapSection>
          </div>}

      </div>
    );
  }
}

PodHealthChecksConfigSection.defaultProps = {
  appConfig: {}
};

PodHealthChecksConfigSection.propTypes = {
  appConfig: React.PropTypes.object,
  onEditClick: React.PropTypes.func
};

module.exports = PodHealthChecksConfigSection;
