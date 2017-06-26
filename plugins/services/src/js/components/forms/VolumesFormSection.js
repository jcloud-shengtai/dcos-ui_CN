import { Tooltip } from "reactjs-components";
import React, { Component } from "react";
import Objektiv from "objektiv";

import {
  FormReducer as externalVolumes
} from "../../reducers/serviceForm/ExternalVolumes";
import {
  FormReducer as localVolumes
} from "../../reducers/serviceForm/LocalVolumes";
import AddButton from "../../../../../../src/js/components/form/AddButton";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
import FieldSelect from "../../../../../../src/js/components/form/FieldSelect";
import {
  findNestedPropertyInObject
} from "../../../../../../src/js/utils/Util";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormGroupContainer
  from "../../../../../../src/js/components/form/FormGroupContainer";
import FormGroupHeading
  from "../../../../../../src/js/components/form/FormGroupHeading";
import FormGroupHeadingContent
  from "../../../../../../src/js/components/form/FormGroupHeadingContent";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import Icon from "../../../../../../src/js/components/Icon";
import MetadataStore from "../../../../../../src/js/stores/MetadataStore";

const errorsLens = Objektiv.attr("container", {}).attr("volumes", []);

class VolumesFormSection extends Component {
  getPersistentVolumeConfig(volume, key) {
    if (volume.type !== "PERSISTENT") {
      return null;
    }

    const sizeError = errorsLens
      .at(key, {})
      .attr("persistent", {})
      .get(this.props.errors).size;
    const containerPathError = errorsLens.at(key, {}).get(this.props.errors)
      .containerPath;
    const tooltipContent = (
      <span>
        {
          "您的应用将从此目录进行数据的读写. 该目录必须是容器的一级目录. "
        }
        <a
          href={MetadataStore.buildDocsURI("/usage/storage/persistent-volume/")}
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <FormRow>
        <FormGroup className="column-3" showError={Boolean(sizeError)}>
          <FieldLabel className="text-no-transform">
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                空间 (MiB)
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldInput
            name={`localVolumes.${key}.size`}
            type="number"
            value={volume.size}
          />
          <FieldError>{sizeError}</FieldError>
        </FormGroup>
        <FormGroup className="column-6" showError={Boolean(containerPathError)}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                容器路径
              </FormGroupHeadingContent>
              <FormGroupHeadingContent>
                <Tooltip
                  content={tooltipContent}
                  interactive={true}
                  maxWidth={300}
                  scrollContainer=".gm-scroll-view"
                  wrapText={true}
                >
                  <Icon color="grey" id="circle-question" size="mini" />
                </Tooltip>
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldInput
            name={`localVolumes.${key}.containerPath`}
            type="text"
            value={volume.containerPath}
          />
          <FieldError>{containerPathError}</FieldError>
        </FormGroup>
      </FormRow>
    );
  }

  getHostVolumeConfig(volume, key) {
    if (volume.type !== "HOST") {
      return null;
    }

    const errors = errorsLens.at(key, {}).get(this.props.errors);
    const hostPathError = errors.hostPath;
    const containerPathError = errors.containerPath;
    const modeError = errors.mode;
    const tooltipContent = (
      <span>
        {
          "如果您正在使用 Mesos 容器, 请确保使用容器的一级目录. "
        }
        <a
          href={MetadataStore.buildDocsURI("/usage/storage/external-storage/")}
          target="_blank"
        >
          More information
        </a>.
      </span>
    );

    return (
      <FormRow>
        <FormGroup className="column-4" showError={Boolean(hostPathError)}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                主机路径
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldInput
            name={`localVolumes.${key}.hostPath`}
            value={volume.hostPath}
          />
          <FieldError>{hostPathError}</FieldError>
        </FormGroup>
        <FormGroup className="column-4" showError={Boolean(containerPathError)}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                容器路径
              </FormGroupHeadingContent>
              <FormGroupHeadingContent>
                <Tooltip
                  content={tooltipContent}
                  interactive={true}
                  maxWidth={300}
                  scrollContainer=".gm-scroll-view"
                  wrapText={true}
                >
                  <Icon color="grey" id="circle-question" size="mini" />
                </Tooltip>
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldInput
            name={`localVolumes.${key}.containerPath`}
            type="text"
            value={volume.containerPath}
          />
          <FieldError>{containerPathError}</FieldError>
        </FormGroup>
        <FormGroup className="column-4" showError={Boolean(modeError)}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                模式
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldSelect name={`localVolumes.${key}.mode`} value={volume.mode}>
            <option value="RW">Read and Write</option>
            <option value="RO">Read Only</option>
          </FieldSelect>
        </FormGroup>
      </FormRow>
    );
  }

  getHostOption(dockerImage) {
    if (dockerImage == null || dockerImage === "") {
      return null;
    }

    return (
      <option value="HOST">
        主机卷

      </option>
    );
  }

  getLocalVolumesLines(data) {
    const dockerImage =
      this.props.data.container &&
      this.props.data.container.docker &&
      this.props.data.container.docker.image;

    return data.map((volume, key) => {
      if (
        volume.type === "HOST" &&
        (dockerImage == null || dockerImage === "")
      ) {
        return null;
      }

      const typeError = errorsLens.at(key, {}).get(this.props.errors).type;

      return (
        <FormGroupContainer
          key={key}
          onRemove={this.props.onRemoveItem.bind(this, {
            value: key,
            path: "localVolumes"
          })}
        >
          <FormRow>
            <FormGroup className="column-6" showError={Boolean(typeError)}>
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    卷类型
                  </FormGroupHeadingContent>
                </FormGroupHeading>
              </FieldLabel>
              <FieldSelect
                name={`localVolumes.${key}.type`}
                value={volume.type}
              >
                <option>请选择...</option>
                {this.getHostOption(dockerImage)}
                <option value="PERSISTENT">默认卷</option>
              </FieldSelect>
            </FormGroup>
          </FormRow>
          {this.getPersistentVolumeConfig(volume, key)}
          {this.getHostVolumeConfig(volume, key)}
        </FormGroupContainer>
      );
    });
  }

  /**
   * getExternalVolumesLines
   *
   * @param  {Object} data
   * @param  {Number} offset as we have two independent sections that are 0
   *                  based we need to add an offset to the second one
   * @return {Array} elements
   */
  getExternalVolumesLines(data, offset) {
    return data.map((volume, key) => {
      const nameError = errorsLens
        .at(key + offset, {})
        .attr("external", {})
        .get(this.props.errors).name;

      const sizeError = errorsLens
        .at(key, {})
        .attr("external", {})
        .get(this.props.errors).size;

      const containerPathError = errorsLens
        .at(key + offset, {})
        .get(this.props.errors).containerPath;

      const dockerType = findNestedPropertyInObject(
        this.props.data,
        "container.type"
      );

      let sizeField = (
        <Tooltip
          content="Docker Runtime 只支持默认尺寸的隐藏卷, 如果您想修改大小， 请选择 Mesos Runtime."
          width={300}
          scrollContainer=".gm-scroll-view"
          wrapperClassName="tooltip-wrapper tooltip-block-wrapper text-align-center"
          wrapText={true}
        >
          <FieldInput
            name={`externalVolumes.${key}.size`}
            type="number"
            disabled={true}
            value={""}
          />
        </Tooltip>
      );

      if (dockerType !== "DOCKER") {
        sizeField = (
          <FieldInput
            name={`externalVolumes.${key}.size`}
            type="number"
            value={volume.size}
          />
        );
      }

      return (
        <FormGroupContainer
          key={key}
          onRemove={this.props.onRemoveItem.bind(this, {
            value: key,
            path: "externalVolumes"
          })}
        >
          <FormRow>
            <FormGroup className="column-6" showError={Boolean(nameError)}>
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    名称
                  </FormGroupHeadingContent>
                </FormGroupHeading>
              </FieldLabel>
              <FieldInput
                name={`externalVolumes.${key}.name`}
                type="text"
                value={volume.name}
              />
              <FieldError>{nameError}</FieldError>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup className="column-3" showError={Boolean(sizeError)}>
              <FieldLabel className="text-no-transform">
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    空间 (GiB)
                  </FormGroupHeadingContent>
                </FormGroupHeading>
              </FieldLabel>
              {sizeField}
              <FieldError>{sizeError}</FieldError>
            </FormGroup>
            <FormGroup
              className="column-9"
              showError={Boolean(containerPathError)}
            >
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    容器路径
                  </FormGroupHeadingContent>
                </FormGroupHeading>
              </FieldLabel>
              <FieldInput
                name={`externalVolumes.${key}.containerPath`}
                type="text"
                value={volume.containerPath}
              />
              <FieldError>{containerPathError}</FieldError>
            </FormGroup>
          </FormRow>
        </FormGroupContainer>
      );
    });
  }

  render() {
    const { data } = this.props;

    const tooltipContent = (
      <span>
        {"DC/OS 提供了多种存储选项. "}
        <a href={MetadataStore.buildDocsURI("/usage/storage/")} target="_blank">
          更多信息
        </a>.
      </span>
    );

    return (
      <div>
        <h2 className="flush-top short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              卷
            </FormGroupHeadingContent>
            <FormGroupHeadingContent>
              <Tooltip
                content={tooltipContent}
                interactive={true}
                maxWidth={300}
                scrollContainer=".gm-scroll-view"
                wrapText={true}
              >
                <Icon color="grey" id="circle-question" size="mini" />
              </Tooltip>
            </FormGroupHeadingContent>
          </FormGroupHeading>
        </h2>
        <p>
          配置首选卷以创建一个状态服务. 首选卷可以让实例重启时保留数据.
        </p>
        <h3 className="short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              本地卷
            </FormGroupHeadingContent>
          </FormGroupHeading>
        </h3>
        <p>
          {
            "如果需要快速访问存储的数据，请选择本地持久卷. "
          }
          <a
            href={MetadataStore.buildDocsURI(
              "/usage/storage/persistent-volume/"
            )}
            target="_blank"
          >
            更多信息
          </a>.
        </p>
        {this.getLocalVolumesLines(data.localVolumes)}
        <div>
          <AddButton
            onClick={this.props.onAddItem.bind(this, {
              value: data.localVolumes.length,
              path: "localVolumes"
            })}
          >
            添加本地卷
          </AddButton>
        </div>
        <h3 className="short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              外部卷
            </FormGroupHeadingContent>
          </FormGroupHeading>
        </h3>
        <p>
          {
            "如果您的服务对容错有要求，请选择一个外部卷. "
          }
          <a
            href={MetadataStore.buildDocsURI(
              "/usage/storage/external-storage/"
            )}
            target="_blank"
          >
            更多信息
          </a>.
        </p>
        {this.getExternalVolumesLines(
          data.externalVolumes,
          data.localVolumes.length
        )}
        <FormRow>
          <FormGroup className="column-12">
            <AddButton
              onClick={this.props.onAddItem.bind(this, {
                value: data.localVolumes.length,
                path: "externalVolumes"
              })}
            >
              增加外部卷
            </AddButton>
          </FormGroup>
        </FormRow>
      </div>
    );
  }
}

VolumesFormSection.defaultProps = {
  data: {},
  errors: {},
  onAddItem() {},
  onRemoveItem() {}
};

VolumesFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func
};

VolumesFormSection.configReducers = {
  externalVolumes,
  localVolumes
};

VolumesFormSection.validationReducers = {
  localVolumes() {
    return [];
  },
  externalVolumes() {
    return [];
  }
};

module.exports = VolumesFormSection;
