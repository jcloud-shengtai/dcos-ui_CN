const JobStates = {
  INITIAL: {
    stateTypes: ["active"],
    displayName: "启动"
  },
  STARTING: {
    stateTypes: ["active"],
    displayName: "启动"
  },
  ACTIVE: {
    stateTypes: ["active"],
    displayName: "正在运行"
  },
  FAILED: {
    stateTypes: ["completed", "failure"],
    displayName: "执行失败"
  },
  SUCCESS: {
    stateTypes: ["success"],
    displayName: "执行成功"
  },
  COMPLETED: {
    stateTypes: ["success"],
    displayName: "完成"
  },
  SCHEDULED: {
    stateTypes: [],
    displayName: "已加入计划"
  },
  UNSCHEDULED: {
    stateTypes: [],
    displayName: "未加入计划"
  }
};

module.exports = JobStates;
