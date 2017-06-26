import Item from "../../../../../src/js/structs/Item";
import PodContainerTerminationHistory from "./PodContainerTerminationHistory";

module.exports = class PodTerminationHistory extends Item {
  getContainers() {
    const containers = this.get("containers") || [];

    return containers.map(function(container) {
      return new PodContainerTerminationHistory(container);
    });
  }

  getId() {
    return this.get("instanceID");
  }

  getMessage() {
    return this.get("message") || "Pod 已关闭";
  }

  getStartedAt() {
    return new Date(this.get("startedAt"));
  }

  getTerminatedAt() {
    return new Date(this.get("terminatedAt"));
  }
};
