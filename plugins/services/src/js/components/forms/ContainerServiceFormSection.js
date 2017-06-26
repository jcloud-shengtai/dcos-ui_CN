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
import ContainerConstants from "../../constants/ContainerConstants";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldHelp from "../../../../../../src/js/components/form/FieldHelp";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
import FieldTextarea
  from "../../../../../../src/js/components/form/FieldTextarea";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormGroupHeading
  from "../../../../../../src/js/components/form/FormGroupHeading";
import FormGroupHeadingContent
  from "../../../../../../src/js/components/form/FormGroupHeadingContent";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import Icon from "../../../../../../src/js/components/Icon";
import MetadataStore from "../../../../../../src/js/stores/MetadataStore";
import PodSpec from "../../structs/PodSpec";

const { NONE } = ContainerConstants.type;

const appPaths = {
  cmd: "cmd",
  containerName: "",
  cpus: "cpus",
  image: "{basePath}.docker.image",
  mem: "mem",
  type: "{basePath}.type"
};

const podPaths = {
  cmd: "{basePath}.exec.command.shell",
  containerName: "{basePath}.name",
  cpus: "{basePath}.resources.cpus",
  image: "{basePath}.image.id",
  mem: "{basePath}.resources.mem",
  type: "{basePath}.type"
};

class ContainerServiceFormSection extends Component {
  getFieldPath(basePath, fieldName) {
    if (this.props.service instanceof PodSpec) {
      return podPaths[fieldName].replace("{basePath}", basePath);
    }

    return appPaths[fieldName].replace("{basePath}", basePath);
  }

  getCMDLabel() {
    const tooltipContent = (
      <span>
        {
          "The command value will be wrapped by the underlying Mesos executor via /bin/sh -c ${cmd}. "
        }
        <a
          href="https://mesosphere.github.io/marathon/docs/application-basics.html"
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <FieldLabel>
        <FormGroupHeading>
          <FormGroupHeadingContent primary={true}>
            Command
          </FormGroupHeadingContent>
          <FormGroupHeadingContent>
            <Tooltip
              content={tooltipContent}
              interactive={true}
              wrapText={true}
              maxWidth={300}
              scrollContainer=".gm-scroll-view"
            >
              <Icon color="grey" id="circle-question" size="mini" />
            </Tooltip>
          </FormGroupHeadingContent>
        </FormGroupHeading>
      </FieldLabel>
    );
  }

  getImageLabel() {
    const tooltipContent = (
      <span>
        {"导入一个 Docker 镜像 或 浏览 "}
        <a href="https://hub.docker.com/explore/" target="_blank">
          Docker Hub
        </a>
        {
          " 查找更多. 您也可以从您的私有镜像仓库导入. "
        }
        <a
          href={MetadataStore.buildDocsURI(
            "/usage/tutorials/registry/#docs-article"
          )}
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <FieldLabel>
        <FormGroupHeading>
          <FormGroupHeadingContent primary={true}>
            容器镜像
          </FormGroupHeadingContent>
          <FormGroupHeadingContent>
            <Tooltip
              content={tooltipContent}
              interactive={true}
              wrapText={true}
              maxWidth={300}
              scrollContainer=".gm-scroll-view"
            >
              <Icon color="grey" id="circle-question" size="mini" />
            </Tooltip>
          </FormGroupHeadingContent>
        </FormGroupHeading>
      </FieldLabel>
    );
  }

  getContainerNameField() {
    const { data, errors, path, service } = this.props;
    if (!(service instanceof PodSpec)) {
      return null;
    }

    const containerNamePath = this.getFieldPath(path, "containerName");
    const containerName = findNestedPropertyInObject(data, containerNamePath);
    const containerNameErrors = findNestedPropertyInObject(
      errors,
      containerNamePath
    );

    return (
      <FormRow>
        <FormGroup
          className="column-6"
          showError={Boolean(containerNameErrors)}
        >
          <FieldLabel>Container Name</FieldLabel>
          <FieldInput name={containerNamePath} value={containerName} />
          <FieldError>{containerNameErrors}</FieldError>
        </FormGroup>
      </FormRow>
    );
  }

  render() {
    const { data, errors, path, service } = this.props;
    const typePath = this.getFieldPath(path, "type");
    const containerType = findNestedPropertyInObject(data, typePath);
    const imagePath = this.getFieldPath(path, "image");
    const image = findNestedPropertyInObject(data, imagePath);
    const imageDisabled =
      (containerType == null || containerType === NONE) &&
      !(service instanceof PodSpec);
    const imageErrors = findNestedPropertyInObject(errors, imagePath);
    const cpusPath = this.getFieldPath(path, "cpus");
    const cpusErrors = findNestedPropertyInObject(errors, cpusPath);
    const memPath = this.getFieldPath(path, "mem");
    const memErrors = findNestedPropertyInObject(errors, memPath);
    const cmdPath = this.getFieldPath(path, "cmd");
    const cmdErrors = findNestedPropertyInObject(errors, cmdPath);

    let inputNode = (
      <FieldInput name={imagePath} disabled={imageDisabled} value={image} />
    );

    if (imageDisabled) {
      inputNode = (
        <Tooltip
          content="Mesos Runtime 不支持容器镜像, 如果您想使用容器镜像，请选择Docker或Universal."
          width={300}
          scrollContainer=".gm-scroll-view"
          wrapperClassName="tooltip-wrapper tooltip-block-wrapper text-align-center"
          wrapText={true}
        >
          {inputNode}
        </Tooltip>
      );
    }

    return (
      <div className="pod pod-short flush-horizontal flush-bottom">
        {this.getContainerNameField()}
        <FormRow>
          <FormGroup
            className="column-6"
            showError={Boolean(!imageDisabled && imageErrors)}
          >
            {this.getImageLabel()}
            {inputNode}
            <FieldHelp>
              输入一个您想运行的docker镜像, 例如 nginx.
            </FieldHelp>
            <FieldError>{imageErrors}</FieldError>
          </FormGroup>

          <FormGroup className="column-3" showError={Boolean(cpusErrors)}>
            <FieldLabel className="text-no-transform">
              <FormGroupHeading required={true}>
                <FormGroupHeadingContent>
                  CPUs
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
            <FieldInput
              min="0.001"
              name={cpusPath}
              step="any"
              type="number"
              value={findNestedPropertyInObject(data, cpusPath)}
            />
            <FieldError>{cpusErrors}</FieldError>
          </FormGroup>

          <FormGroup className="column-3" showError={Boolean(memErrors)}>
            <FieldLabel className="text-no-transform">
              <FormGroupHeading required={true}>
                <FormGroupHeadingContent primary={true}>
                  内存 (MiB)
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
            <FieldInput
              min="0.001"
              name={memPath}
              step="any"
              type="number"
              value={findNestedPropertyInObject(data, memPath)}
            />
            <FieldError>{memErrors}</FieldError>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup className="column-12" showError={Boolean(cmdErrors)}>
            {this.getCMDLabel()}
            <FieldTextarea
              name={cmdPath}
              value={findNestedPropertyInObject(data, cmdPath)}
            />
            <FieldHelp>
              由您的容器来执行的shell命令.
            </FieldHelp>
            <FieldError>{cmdErrors}</FieldError>
          </FormGroup>
        </FormRow>
      </div>
    );
  }
}

ContainerServiceFormSection.defaultProps = {
  data: {},
  errors: {},
  onAddItem() {},
  onRemoveItem() {},
  path: "container"
};

ContainerServiceFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func,
  path: React.PropTypes.string
};

ContainerServiceFormSection.configReducers = {
  container: ContainerReducer,
  containers: ContainersReducer
};

module.exports = ContainerServiceFormSection;
