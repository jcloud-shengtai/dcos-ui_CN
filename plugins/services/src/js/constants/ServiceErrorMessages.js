import DefaultErrorMessages
  from "../../../../../src/js/constants/DefaultErrorMessages";

const ServiceErrorMessages = [
  {
    path: /^id$/,
    type: "PROP_IS_MISSING",
    message: "必须指定"
  },
  {
    path: /^id$/,
    type: "ALREADY_EXISTS",
    message: "已存在"
  },
  {
    path: /^id$/,
    type: "STRING_PATTERN",
    message: "可以包括数字 (0-9), 破折号 (-), " +
      "点 (.),小写字母 (a-z), 和 斜杠 (/) 例如 /group/my-service"
  },
  {
    path: /.*/,
    type: "SERVICE_DEPLOYING",
    message: "服务当前被一个或多个部署锁定. " +
      "再次点击以强制操作."
  }
].concat(DefaultErrorMessages);

module.exports = ServiceErrorMessages;
