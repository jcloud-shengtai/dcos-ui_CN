/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import JobValidatorUtil from "../../utils/JobValidatorUtil";
import MetadataStore from "../../stores/MetadataStore";
import ValidatorUtil from "../../utils/ValidatorUtil";

const Schedule = {
  title: "执行计划",
  description: "设置任务执行时间",
  type: "object",
  properties: {
    runOnSchedule: {
      label: "按计划执行",
      showLabel: true,
      title: "Run on a schedule",
      type: "boolean",
      getter(job) {
        const [schedule] = job.getSchedules();

        return schedule != null;
      }
    },
    cron: {
      title: "CRON表达式",
      helpBlock: (
        <span>
          使用cron表达式设置任务计划, e.g. <i>0 0 20 * *</i>{". "}
          <a
            href={MetadataStore.buildDocsURI("/usage/jobs/getting-started")}
            target="_blank"
          >
            帮助文档
          </a>.
        </span>
      ),
      type: "string",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.cron;
      },
      externalValidator({ schedule }, definition) {
        if (!schedule.runOnSchedule) {
          return true;
        }

        if (!JobValidatorUtil.isValidCronSchedule(schedule.cron)) {
          definition.showError =
            "CRON表达式不能为空，并且必须遵循正确的CRON格式规范";

          return false;
        }

        return true;
      }
    },
    timezone: {
      title: "时区",
      description: (
        <span>
          {"输入 "}
          <a
            href="http://www.timezoneconverter.com/cgi-bin/zonehelp"
            target="_blank"
          >
            TZ格式
          </a>的时区, e.g. America/New_York.
        </span>
      ),
      type: "string",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.timezone;
      }
    },
    startingDeadlineSeconds: {
      title: "最迟开始时间",
      description: "不论什么原因错过预定时间，则将以秒为单位启动任务. 错失的任务将按失败统计.",
      type: "number",
      getter(job) {
        const [schedule = {}] = job.getSchedules();

        return schedule.startingDeadlineSeconds;
      },
      externalValidator({ schedule }, definition) {
        if (!schedule.runOnSchedule) {
          return true;
        }

        if (!ValidatorUtil.isDefined(schedule.startingDeadlineSeconds)) {
          return true;
        }

        if (!ValidatorUtil.isNumberInRange(schedule.startingDeadlineSeconds)) {
          definition.showError = "Expecting a positive number here";

          return true;
        }

        return true;
      }
    }
  },
  required: ["cron"]
};

module.exports = Schedule;
