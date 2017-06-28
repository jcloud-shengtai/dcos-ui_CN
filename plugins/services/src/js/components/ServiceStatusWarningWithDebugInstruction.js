import DateUtil from "../../../../../src/js/utils/DateUtil";
import ServiceStatusWarning from "./ServiceStatusWarning";

class ServiceStatusWarningWithDebugInstruction extends ServiceStatusWarning {
  getTooltipContent(timeWaiting) {
    const additionalCopy = " 在debug选项卡中查看更多信息.";

    return `JSSP 正在部署，当前无法完成 ${DateUtil.getDuration(timeWaiting, null)}.${additionalCopy} 的部署`;
  }
}

module.exports = ServiceStatusWarningWithDebugInstruction;
