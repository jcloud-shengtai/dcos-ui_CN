import DateUtil from "../../../../../src/js/utils/DateUtil";
import ServiceStatusWarning from "./ServiceStatusWarning";

class ServiceStatusWarningWithDebugInstruction extends ServiceStatusWarning {
  getTooltipContent(timeWaiting) {
    const additionalCopy = " See more information in the debug tab.";

    return `DC/OS 正在等待资源，当前无法完成 ${DateUtil.getDuration(timeWaiting, null)}.${additionalCopy} 的部署`;
  }
}

module.exports = ServiceStatusWarningWithDebugInstruction;
