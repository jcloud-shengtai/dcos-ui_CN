const TaskStates = {
  TASK_CREATED: {
    stateTypes: ["active", "success"],
    displayName: "已创建"
  },

  TASK_STAGING: {
    stateTypes: ["active", "success"],
    displayName: "Staging"
  },

  TASK_STARTING: {
    stateTypes: ["active", "success"],
    displayName: "启动中"
  },

  TASK_STARTED: {
    stateTypes: ["active", "success"],
    displayName: "已启动"
  },

  TASK_RUNNING: {
    stateTypes: ["active", "success"],
    displayName: "运行中"
  },

  TASK_KILLING: {
    stateTypes: ["active", "failure"],
    displayName: "正在终止"
  },

  TASK_FINISHED: {
    stateTypes: ["completed", "success"],
    displayName: "已完成"
  },

  TASK_KILLED: {
    stateTypes: ["completed", "failure"],
    displayName: "已终止"
  },

  TASK_FAILED: {
    stateTypes: ["completed", "failure"],
    displayName: "失败"
  },

  TASK_LOST: {
    stateTypes: ["completed", "failure"],
    displayName: "丢失"
  },

  TASK_ERROR: {
    stateTypes: ["completed", "failure"],
    displayName: "出错"
  },

  TASK_GONE: {
    stateTypes: ["completed", "failure"],
    displayName: "Gone"
  },

  TASK_GONE_BY_OPERATOR: {
    stateTypes: ["completed", "failure"],
    displayName: "Gone by operator"
  },

  TASK_DROPPED: {
    stateTypes: ["completed", "failure"],
    displayName: "已丢弃"
  },

  TASK_UNREACHABLE: {
    stateTypes: ["completed", "failure"],
    displayName: "不可达"
  },

  TASK_UNKNOWN: {
    stateTypes: ["completed", "failure"],
    displayName: "未知"
  }
};

module.exports = TaskStates;
