const HealthBarStates = {
  tasksUnknown: {
    className: "unknown",
    label: "未知"
  },
  tasksHealthy: {
    className: "healthy",
    label: ""
  },
  tasksOverCapacity: {
    className: "over-capacity",
    label: "过载"
  },
  tasksUnhealthy: {
    className: "unhealthy",
    label: "异常"
  },
  tasksStaged: {
    className: "staged",
    label: "Staged"
  }
};

module.exports = HealthBarStates;
