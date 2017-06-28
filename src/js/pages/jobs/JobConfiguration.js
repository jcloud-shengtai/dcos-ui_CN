import React from "react";

import ConfigurationMap from "../../components/ConfigurationMap";
import ConfigurationMapHeading from "../../components/ConfigurationMapHeading";
import ConfigurationMapLabel from "../../components/ConfigurationMapLabel";
import ConfigurationMapRow from "../../components/ConfigurationMapRow";
import ConfigurationMapSection from "../../components/ConfigurationMapSection";
import ConfigurationMapValue from "../../components/ConfigurationMapValue";
import HashMapDisplay from "../../components/HashMapDisplay";
import Job from "../../structs/Job";

class JobConfiguration extends React.Component {
  getSchedule(job) {
    const lastSchedule = job.getSchedules()[0];

    if (!!lastSchedule && !!lastSchedule.cron) {
      return lastSchedule.cron;
    }

    return "No schedule available.";
  }

  getGeneralSection(job) {
    return (
      <ConfigurationMapSection>
        <ConfigurationMapHeading>
          基础信息
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            ID
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {job.getId()}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            描述
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {job.getDescription()}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            CPU数量
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {job.getCpus()}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            内存(MiB)
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {job.getMem()}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            磁盘空间(Mib)
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {job.getDisk()}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            指令
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            <pre className="flush transparent wrap">
              {job.getCommand()}
            </pre>
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getScheduleSection(job) {
    const [schedule] = job.getSchedules();
    if (schedule == null) {
      return null;
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapHeading>
          执行计划
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            ID
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {schedule.id}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            有效的
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {schedule.enabled}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            CRON表达式
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {schedule.cron}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            时区
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {schedule.timezone}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            最迟执行时间
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {schedule.startingDeadlineSeconds}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getDockerContainerSection(job) {
    const docker = job.getDocker();
    if (docker == null || !docker.image) {
      return null;
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapHeading>
          Docker容器
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            镜像
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {docker.image}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getLabelSection(job) {
    return <HashMapDisplay hash={job.getLabels()} headline="Labels" />;
  }

  render() {
    const { job } = this.props;

    return (
      <div className="container">
        <ConfigurationMap>
          {this.getGeneralSection(job)}
          {this.getScheduleSection(job)}
          {this.getDockerContainerSection(job)}
          {this.getLabelSection(job)}
        </ConfigurationMap>
      </div>
    );
  }
}

JobConfiguration.propTypes = {
  job: React.PropTypes.instanceOf(Job).isRequired
};

module.exports = JobConfiguration;
