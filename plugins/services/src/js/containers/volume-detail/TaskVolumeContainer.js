import { DCOSStore } from "foundation-ui";
import React from "react";

import MesosStateStore from "../../../../../../src/js/stores/MesosStateStore";
import ServiceItemNotFound from "../../components/ServiceItemNotFound";
import VolumeDetail from "./VolumeDetail";
import Loader from "../../../../../../src/js/components/Loader";

import { DCOS_CHANGE } from "../../../../../../src/js/constants/EventTypes";

const METHODS_TO_BIND = ["onStoreChange"];

class TaskVolumeContainer extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      isLoading: !DCOSStore.serviceDataReceived,
      lastUpdate: 0
    };

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    DCOSStore.addChangeListener(DCOS_CHANGE, this.onStoreChange);
  }

  componentWillUnmount() {
    DCOSStore.removeChangeListener(DCOS_CHANGE, this.onStoreChange);
  }

  onStoreChange() {
    // Throttle updates from DCOSStore
    if (
      Date.now() - this.state.lastUpdate > 1000 ||
      (DCOSStore.serviceDataReceived && this.state.isLoading)
    ) {
      this.setState({
        isLoading: !DCOSStore.serviceDataReceived,
        lastUpdate: Date.now()
      });
    }
  }

  render() {
    const { taskID, volumeID } = this.props.params;
    const task = MesosStateStore.getTaskFromTaskID(taskID);
    const service = DCOSStore.serviceTree.findItemById(task.getServiceId());
    const volumeId = decodeURIComponent(volumeID);

    if (this.state.isLoading) {
      return <Loader />;
    }

    if (!service) {
      return (
        <ServiceItemNotFound
          message={`无法找到 ID 为 "${taskID}" 的服务.`}
        />
      );
    }

    const volume = service.getVolumes().findItem(volume => {
      return volume.getId() === volumeId;
    });

    if (!volume) {
      return (
        <ServiceItemNotFound message={`无法找到 卷 '${volumeId}'.`} />
      );
    }

    return <VolumeDetail service={service} volume={volume} />;
  }
}

TaskVolumeContainer.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = TaskVolumeContainer;
