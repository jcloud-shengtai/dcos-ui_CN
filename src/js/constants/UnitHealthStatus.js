const UnitHealthStatus = {
  HEALTHY: {
    title: "正常",
    value: 0,
    classNames: "text-success"
  },
  UNHEALTHY: {
    title: "异常",
    value: 1,
    classNames: "text-danger"
  },
  WARN: {
    title: "警告",
    value: 2,
    classNames: "text-warning"
  },
  NA: {
    title: "未知",
    value: 3,
    classNames: "text-mute"
  }
};

module.exports = UnitHealthStatus;
