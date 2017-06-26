import classNames from "classnames";
import React, { Component } from "react";
import { Tooltip } from "reactjs-components";

import {
  FormReducer as ContainerReducer
} from "../../reducers/serviceForm/Container";
import {
  FormReducer as ContainersReducer
} from "../../reducers/serviceForm/Containers";
import {
  findNestedPropertyInObject
} from "../../../../../../src/js/utils/Util";
import ArtifactsSection from "./ArtifactsSection";
import ContainerConstants from "../../constants/ContainerConstants";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldHelp from "../../../../../../src/js/components/form/FieldHelp";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormGroupHeadingContent
  from "../../../../../../src/js/components/form/FormGroupHeadingContent";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import PodSpec from "../../structs/PodSpec";

const { DOCKER } = ContainerConstants.type;

const containerSettings = {
  privileged: {
    label: "授予容器特权",
    helpText: "默认容器都是非授权的，并且没有特殊权限。比如在一个docker内运行另一个docker.",
    dockerOnly: "只有在Docker容器中才支持授予特权操作."
  },
  forcePullImage: {
    label: "启动时强制拉取镜像",
    helpText: "在启动每个实例前强制拉取镜像.",
    dockerOnly: "启动前强制拉取镜像只在docker容器下才支持."
  }
};

const appPaths = {
  artifacts: "fetch",
  cmd: "cmd",
  containerName: "",
  cpus: "cpus",
  disk: "disk",
  forcePullImage: "{basePath}.docker.forcePullImage",
  gpus: "gpus",
  image: "{basePath}.docker.image",
  mem: "mem",
  privileged: "{basePath}.docker.privileged",
  type: "{basePath}.type"
};

const podPaths = {
  artifacts: "{basePath}.artifacts",
  cmd: "{basePath}.exec.command.shell",
  containerName: "{basePath}.name",
  cpus: "{basePath}.resources.cpus",
  disk: "{basePath}.resources.disk",
  forcePullImage: "",
  gpus: "",
  image: "{basePath}.image.id",
  mem: "{basePath}.resources.mem",
  privileged: "",
  type: "{basePath}.type"
};

class ContainerServiceFormAdvancedSection extends Component {
  getFieldPath(basePath, fieldName) {
    if (this.props.service instanceof PodSpec) {
      return podPaths[fieldName].replace("{basePath}", basePath);
    }

    return appPaths[fieldName].replace("{basePath}", basePath);
  }

  isGpusDisabled() {
    const { data, path } = this.props;
    const typePath = this.getFieldPath(path, "type");

    return findNestedPropertyInObject(data, typePath) === DOCKER;
  }

  getGPUSField() {
    const { data, errors, path, service } = this.props;
    if (service instanceof PodSpec) {
      return null;
    }

    const gpusPath = this.getFieldPath(path, "gpus");
    const gpusErrors = findNestedPropertyInObject(errors, gpusPath);
    const gpusDisabled = this.isGpusDisabled();

    let inputNode = (
      <FieldInput
        disabled={gpusDisabled}
        min="0"
        name={gpusPath}
        step="any"
        type="number"
        value={findNestedPropertyInObject(data, gpusPath)}
      />
    );

    if (gpusDisabled) {
      inputNode = (
        <Tooltip
          content="Docker 引擎不支持GPU 资源, 如果想使用GPU资源，请选择 Universal 容器环境."
          interactive={true}
          maxWidth={300}
          scrollContainer=".gm-scroll-view"
          wrapText={true}
          wrapperClassName="tooltip-wrapper tooltip-block-wrapper"
        >
          {inputNode}
        </Tooltip>
      );
    }

    return (
      <FormGroup
        className="column-4"
        showError={Boolean(!gpusDisabled && gpusErrors)}
      >
        <FieldLabel className="text-no-transform">
          <FormGroupHeadingContent primary={true}>
            GPUs
          </FormGroupHeadingContent>
        </FieldLabel>
        {inputNode}
        <FieldError>{gpusErrors}</FieldError>
      </FormGroup>
    );
  }

  getContainerSettings() {
    const { data, errors, path, service } = this.props;
    if (service instanceof PodSpec) {
      return null;
    }

    const typePath = this.getFieldPath(path, "type");
    const containerType = findNestedPropertyInObject(data, typePath);
    const typeErrors = findNestedPropertyInObject(errors, typePath);
    const sectionCount = Object.keys(containerSettings).length;
    const selections = Object.keys(
      containerSettings
    ).map((settingName, index) => {
      const { helpText, label, dockerOnly } = containerSettings[settingName];
      const settingsPath = this.getFieldPath(path, settingName);
      const checked = findNestedPropertyInObject(data, settingsPath);
      const isDisabled = containerType !== DOCKER;
      const labelNodeClasses = classNames({
        "disabled muted": isDisabled,
        "flush-bottom": index === sectionCount - 1
      });

      let labelNode = (
        <FieldLabel key={`label.${index}`} className={labelNodeClasses}>
          <FieldInput
            checked={!isDisabled && Boolean(checked)}
            name={settingsPath}
            type="checkbox"
            disabled={isDisabled}
            value={settingName}
          />
          {label}
          <FieldHelp>{helpText}</FieldHelp>
        </FieldLabel>
      );

      if (isDisabled) {
        labelNode = (
          <Tooltip
            content={dockerOnly}
            key={`tooltip.${index}`}
            position="top"
            scrollContainer=".gm-scroll-view"
            width={300}
            wrapperClassName="tooltip-wrapper tooltip-block-wrapper"
            wrapText={true}
          >
            {labelNode}
          </Tooltip>
        );
      }

      return labelNode;
    });

    return (
      <FormGroup showError={Boolean(typeErrors)}>
        {selections}
        <FieldError>{typeErrors}</FieldError>
      </FormGroup>
    );
  }

  render() {
    const { data, errors, path } = this.props;
    const artifactsPath = this.getFieldPath(path, "artifacts");
    const artifacts = findNestedPropertyInObject(data, artifactsPath) || [];
    const artifactErrors = findNestedPropertyInObject(
      errors,
      artifactsPath
    ) || [];
    const diskPath = this.getFieldPath(path, "disk");
    const diskErrors = findNestedPropertyInObject(errors, diskPath);

    return (
      <div>
        <h3 className="short-bottom">
          高级设置
        </h3>
        <p>高级设置与您选择的运行时环境有关.</p>
        {this.getContainerSettings()}
        <FormRow>
          {this.getGPUSField()}
          <FormGroup className="column-4" showError={Boolean(diskErrors)}>
            <FieldLabel className="text-no-transform">
              <FormGroupHeadingContent primary={true}>
                磁盘 (MiB)
              </FormGroupHeadingContent>
            </FieldLabel>
            <FieldInput
              min="0.001"
              name={diskPath}
              step="any"
              type="number"
              value={findNestedPropertyInObject(data, diskPath)}
            />
            <FieldError>{diskErrors}</FieldError>
          </FormGroup>
        </FormRow>
        <ArtifactsSection
          data={artifacts}
          path={artifactsPath}
          errors={artifactErrors}
          onRemoveItem={this.props.onRemoveItem}
          onAddItem={this.props.onAddItem}
        />
      </div>
    );
  }
}

ContainerServiceFormAdvancedSection.defaultProps = {
  data: {},
  errors: {},
  onAddItem() {},
  onRemoveItem() {},
  path: "container"
};

ContainerServiceFormAdvancedSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func,
  path: React.PropTypes.string
};

ContainerServiceFormAdvancedSection.configReducers = {
  container: ContainerReducer,
  containers: ContainersReducer
};

module.exports = ContainerServiceFormAdvancedSection;
