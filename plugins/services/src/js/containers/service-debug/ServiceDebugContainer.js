import React from "react";
import { routerShape } from "react-router";

import Alert from "../../../../../../src/js/components/Alert";
import ConfigurationMap
  from "../../../../../../src/js/components/ConfigurationMap";
import ConfigurationMapHeading
  from "../../../../../../src/js/components/ConfigurationMapHeading";
import ConfigurationMapLabel
  from "../../../../../../src/js/components/ConfigurationMapLabel";
import ConfigurationMapRow
  from "../../../../../../src/js/components/ConfigurationMapRow";
import ConfigurationMapSection
  from "../../../../../../src/js/components/ConfigurationMapSection";
import ConfigurationMapValue
  from "../../../../../../src/js/components/ConfigurationMapValue";
import DateUtil from "../../../../../../src/js/utils/DateUtil";
import DeclinedOffersHelpText from "../../constants/DeclinedOffersHelpText";
import DeclinedOffersTable from "../../components/DeclinedOffersTable";
import DeclinedOffersUtil from "../../utils/DeclinedOffersUtil";
import MarathonStore from "../../stores/MarathonStore";
import RecentOffersSummary from "../../components/RecentOffersSummary";
import Service from "../../structs/Service";
import TaskStatsTable from "./TaskStatsTable";
import TimeAgo from "../../../../../../src/js/components/TimeAgo";

const METHODS_TO_BIND = ["handleJumpToRecentOffersClick"];

class ServiceDebugContainer extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    MarathonStore.setShouldEmbedLastUnusedOffers(true);
  }

  componentWillUnmount() {
    MarathonStore.setShouldEmbedLastUnusedOffers(false);
  }

  getValueText(value) {
    if (value == null || value === "") {
      return <p>未指定</p>;
    }

    return <span>{value}</span>;
  }

  getLastTaskFailureInfo() {
    const lastTaskFailure = this.props.service.getLastTaskFailure();
    if (lastTaskFailure == null) {
      return <p>该应用没有失败的任务</p>;
    }

    const {
      version,
      timestamp,
      taskId,
      state,
      message,
      host
    } = lastTaskFailure;

    return (
      <ConfigurationMapSection>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            任务ID
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getValueText(taskId)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            状态
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getValueText(state)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            消息
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getValueText(message)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            主机
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getValueText(host)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            时间戳
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {timestamp} (<TimeAgo time={new Date(timestamp)} />)
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            版本
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {version} (<TimeAgo time={new Date(version)} />)
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getLastVersionChange() {
    const versionInfo = this.props.service.getVersionInfo();
    if (versionInfo == null) {
      return <p>该应用没有版本变更信息</p>;
    }

    const { lastScalingAt, lastConfigChangeAt } = versionInfo;
    let lastScaling = "自从上次配置变更后无相关操作";
    if (lastScalingAt !== lastConfigChangeAt) {
      lastScaling = (
        <span>
          {lastScalingAt} (<TimeAgo time={new Date(lastScalingAt)} />)
        </span>
      );
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            扩展或重启
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {lastScaling}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            配置
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {`${lastConfigChangeAt} `}
            (<TimeAgo time={new Date(lastConfigChangeAt)} />)
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getRecentOfferSummary() {
    const { service } = this.props;
    const queue = service.getQueue();
    let introText = null;
    let mainContent = null;
    let offerCount = null;

    if (this.isFramework(service)) {
      const { labels = {} } = service;
      const frameworkName = labels.DCOS_PACKAGE_FRAMEWORK_NAME;

      if (frameworkName != null) {
        introText = `服务 ${frameworkName} 当前不支持拒绝服务分析.`;
      } else {
        introText = "当前不支持拒绝服务分析.";
      }
    } else if (
      !DeclinedOffersUtil.shouldDisplayDeclinedOffersWarning(service) ||
      queue.declinedOffers.summary == null
    ) {
      introText =
        "当你的服务正在部署或等待资源时，资源分配会出现在这里.";
    } else {
      const { declinedOffers: { summary } } = queue;
      const { roles: { offers = 0 } } = summary;

      introText = DeclinedOffersHelpText.summaryIntro;

      mainContent = (
        <div>
          <ConfigurationMapHeading level={2}>
            概要
          </ConfigurationMapHeading>
          <RecentOffersSummary data={summary} />
        </div>
      );

      offerCount = ` (${offers})`;
    }

    return (
      <div
        ref={ref => {
          this.offerSummaryRef = ref;
        }}
      >
        <ConfigurationMapHeading>
          最近的资源分配{offerCount}
        </ConfigurationMapHeading>
        <p>{introText}</p>
        {mainContent}
      </div>
    );
  }

  getDeclinedOffersTable() {
    const { service } = this.props;

    if (this.isFramework(service)) {
      return null;
    }

    const queue = service.getQueue();

    if (
      !DeclinedOffersUtil.shouldDisplayDeclinedOffersWarning(service) ||
      queue.declinedOffers.offers == null
    ) {
      return null;
    }

    return (
      <div>
        <ConfigurationMapHeading level={2}>
          细节
        </ConfigurationMapHeading>
        <DeclinedOffersTable
          offers={queue.declinedOffers.offers}
          service={service}
          summary={queue.declinedOffers.summary}
        />
      </div>
    );
  }

  getTaskStats() {
    const taskStats = this.props.service.getTaskStats();

    if (taskStats.getList().getItems().length === 0) {
      return <p>该应用没有任务统计</p>;
    }

    return <TaskStatsTable taskStats={taskStats} />;
  }

  getWaitingForResourcesNotice() {
    const { service } = this.props;

    if (this.isFramework(service)) {
      return null;
    }

    const queue = service.getQueue();

    if (queue == null || queue.since == null) {
      return null;
    }

    const waitingSince = DateUtil.strToMs(queue.since);
    const timeWaiting = Date.now() - waitingSince;

    // If the service has been waiting for less than five minutes, we don't
    // display the warning.
    if (timeWaiting < 1000 * 60 * 5) {
      return null;
    }

    return (
      <Alert>
        {
          "JSSP 正在等待资源，无法完成这次 "
        }
        {DateUtil.getDuration(timeWaiting, null)}{"部署. "}
        <a className="clickable" onClick={this.handleJumpToRecentOffersClick}>
          查看最近的资源offers
        </a>.
      </Alert>
    );
  }

  handleJumpToRecentOffersClick() {
    if (this.offerSummaryRef) {
      this.offerSummaryRef.scrollIntoView();
    }
  }

  isFramework(service) {
    const { labels = {} } = service;

    return (
      labels.DCOS_PACKAGE_FRAMEWORK_NAME != null ||
      labels.DCOS_PACKAGE_IS_FRAMEWORK != null
    );
  }

  render() {
    return (
      <div className="container">
        {this.getWaitingForResourcesNotice()}
        <ConfigurationMap>
          <ConfigurationMapSection>
            <ConfigurationMapHeading>
              最近修改
            </ConfigurationMapHeading>
            {this.getLastVersionChange()}
          </ConfigurationMapSection>
          <ConfigurationMapSection>
            <ConfigurationMapHeading>
              最近失败的任务
            </ConfigurationMapHeading>
            {this.getLastTaskFailureInfo()}
          </ConfigurationMapSection>
          <ConfigurationMapSection>
            <ConfigurationMapHeading>
              任务统计
            </ConfigurationMapHeading>
            {this.getTaskStats()}
          </ConfigurationMapSection>
          {this.getRecentOfferSummary()}
          {this.getDeclinedOffersTable()}
        </ConfigurationMap>
      </div>
    );
  }
}

ServiceDebugContainer.contextTypes = {
  router: routerShape
};

ServiceDebugContainer.propTypes = {
  service: React.PropTypes.instanceOf(Service)
};

module.exports = ServiceDebugContainer;
