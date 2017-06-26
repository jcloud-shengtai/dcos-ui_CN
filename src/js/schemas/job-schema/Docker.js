/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

const General = {
  title: "Docker容器",
  description: "配置任务信息",
  type: "object",
  properties: {
    image: {
      title: "镜像",
      description: "镜像名称",
      type: "string",
      getter(job) {
        return job.getDocker().image;
      }
    }
  },
  required: []
};

module.exports = General;
