import React from "react";

import Alert from "../../../../../src/js/components/Alert";
import ConfigurationMapHeading
  from "../../../../../src/js/components/ConfigurationMapHeading";
import PodContainerConfigSection from "./PodContainerConfigSection";

function renderContainers(appConfig, handleEditClick) {
  const { containers = [] } = appConfig;

  return containers.map((container, index) => {
    return (
      <PodContainerConfigSection
        appConfig={appConfig}
        containerConfig={container}
        key={`pod-container-${container.name}`}
        onEditClick={handleEditClick}
        index={index}
      />
    );
  });
}

const PodContainersConfigSection = ({ appConfig, onEditClick }) => {
  if (!appConfig.containers || !appConfig.containers.length) {
    return (
      <div>
        <ConfigurationMapHeading level={2}>Containers</ConfigurationMapHeading>
        <Alert>
          未指定容器! 请至少指定一个容器!
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <ConfigurationMapHeading level={2}>Containers</ConfigurationMapHeading>
      {renderContainers(appConfig, onEditClick)}
    </div>
  );
};

PodContainersConfigSection.propTypes = {
  onEditClick: React.PropTypes.func
};

module.exports = PodContainersConfigSection;
