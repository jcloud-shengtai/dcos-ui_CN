import { DCOSStore } from "foundation-ui";
import React from "react";

import ConfigurationMapHeading
  from "../../../../../src/js/components/ConfigurationMapHeading";
import ConfigurationMapLabel
  from "../../../../../src/js/components/ConfigurationMapLabel";
import ConfigurationMapRow
  from "../../../../../src/js/components/ConfigurationMapRow";
import ConfigurationMapSection
  from "../../../../../src/js/components/ConfigurationMapSection";
import ConfigurationMapValue
  from "../../../../../src/js/components/ConfigurationMapValue";

class MarathonTaskDetailsList extends React.Component {
  getTaskPorts(task) {
    const { ports } = task;
    if (!ports || !ports.length) {
      return "None";
    }

    return ports.join(", ");
  }

  getTaskStatus(task) {
    if (task == null || task.status == null) {
      return "Unknown";
    }

    return task.status;
  }

  getTimeField(time) {
    let timeString = "从不";

    if (time != null) {
      timeString = new Date(time).toLocaleString();
    }

    return (
      <time dateTime={time} title={time}>
        {timeString}
      </time>
    );
  }

  getMarathonTaskDetails(task) {
    if (task == null) {
      return null;
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapHeading>
          Marathon 任务配置
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            主机
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {task.host}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            端口
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskPorts(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            状态
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskStatus(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            创建时间
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.stagedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            启动时间
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.startedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            版本
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {task.version}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getMarathonTaskHealthCheckResults(task) {
    if (task == null || task.healthCheckResults == null) {
      return null;
    }

    return task.healthCheckResults.map((result, i) => {
      let consecutiveFailures = result.consecutiveFailures;
      let alive = "是";

      if (consecutiveFailures == null) {
        consecutiveFailures = "无";
      }

      if (!result.alive) {
        alive = "否";
      }

      return (
        <ConfigurationMapSection key={i}>
          <ConfigurationMapHeading>
            健康度检查结果 {i + 1}
          </ConfigurationMapHeading>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              首次成功
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.firstSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              最近成功
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              最近失败
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastFailure)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              连续失败次数
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {consecutiveFailures}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              存活
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {alive}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
        </ConfigurationMapSection>
      );
    });
  }

  render() {
    const marathonTask = DCOSStore.serviceTree.getTaskFromTaskID(
      this.props.taskID
    );
    const taskConfiguration = this.getMarathonTaskDetails(marathonTask);
    const healthCheckResults = this.getMarathonTaskHealthCheckResults(
      marathonTask
    );

    return (
      <ConfigurationMapSection>
        {taskConfiguration}
        {healthCheckResults}
      </ConfigurationMapSection>
    );
  }
}

MarathonTaskDetailsList.propTypes = {
  taskID: React.PropTypes.string.isRequired
};

module.exports = MarathonTaskDetailsList;
