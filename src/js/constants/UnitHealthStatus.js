const UnitHealthStatus = {
  HEALTHY: {
    title: "Healthy",
    titleView: "正常",
    value: 0,
    classNames: "text-success"
  },
  UNHEALTHY: {
    title: "Unhealthy",
    titleView: "异常",
    value: 1,
    classNames: "text-danger"
  },
  WARN: {
    title: "Warning",
    titleView: "警告",
    value: 2,
    classNames: "text-warning"
  },
  NA: {
    title: "N/A",
    titleView: "未知",
    value: 3,
    classNames: "text-mute"
  }
};

module.exports = UnitHealthStatus;
