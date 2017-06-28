import { Tooltip } from "reactjs-components";
import React, { Component } from "react";
import Objektiv from "objektiv";

import { getContainerNameWithIcon } from "../../utils/ServiceConfigDisplayUtil";
import AddButton from "../../../../../../src/js/components/form/AddButton";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
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
import {
  FormReducer as volumeMounts
} from "../../reducers/serviceForm/MultiContainerVolumes";

const errorsLens = Objektiv.attr("container", {}).attr("volumes", []);

class MultiContainerVolumesFormSection extends Component {
  getContainerMounts(containers, volumeMountIndex) {
    const { volumeMounts } = this.props.data;

    return containers.map((container, containerIndex) => {
      let containersLabel = null;
      let pathLabel = null;
      if (containerIndex === 0) {
        containersLabel = (
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                容器
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
        );
        pathLabel = (
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                容器路径
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
        );
      }

      return (
        <FormRow key={containerIndex}>
          <FormGroup className="column-3">
            {containersLabel}
            <div className="form-control-input-height">
              {getContainerNameWithIcon(container)}
            </div>
          </FormGroup>
          <FormGroup className="column-9">
            {pathLabel}
            <FieldInput
              name={`volumeMounts.${volumeMountIndex}.mountPath.${containerIndex}`}
              type="text"
              value={volumeMounts[volumeMountIndex].mountPath[containerIndex]}
            />
          </FormGroup>
        </FormRow>
      );
    });
  }

  /**
   * getExternalVolumesLines
   *
   * @param  {Object} data
   * @param  {Number} offset as we have two independent sections that are 0
   *   based we need to add an offset to the second one
   * @return {Array} elements
   */
  getVolumesMountLines(data, offset) {
    const { containers } = this.props.data;

    return data.map((volumes, key) => {
      const nameError = errorsLens
        .at(key + offset, {})
        .attr("volumes", {})
        .get(this.props.errors).name;
      const removeHandler = this.props.onRemoveItem.bind(this, {
        value: key,
        path: "volumeMounts"
      });

      return (
        <FormGroupContainer onRemove={removeHandler} key={key}>
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
                name={`volumeMounts.${key}.name`}
                type="text"
                value={volumes.name}
              />
              <FieldError>{nameError}</FieldError>
            </FormGroup>
          </FormRow>
          {this.getContainerMounts(containers, key)}
        </FormGroupContainer>
      );
    });
  }

  getHeadline() {
    const tooltipContent = (
      <span>
        {"JSSP 提供了多个存储选项. "}
        <a href={MetadataStore.buildDocsURI("/usage/storage/")} target="_blank">
          更多信息
        </a>.
      </span>
    );

    return (
      <h2 className="flush-top short-bottom">
        <FormGroupHeading>
          <FormGroupHeadingContent primary={true}>
            Volumes
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
    );
  }

  render() {
    const { data, handleTabChange } = this.props;

    if (!data.containers || !data.containers.length) {
      return (
        <div>
          {this.getHeadline()}
          <p>
            {"配置卷信息前，请 "}
            <a
              onClick={handleTabChange.bind(null, "services")}
              className="clickable"
            >
              添加容器
            </a>
            {"."}
          </p>
        </div>
      );
    }

    return (
      <div>
        {this.getHeadline()}
        <p>
          通过配置首选卷以创建一个状态服务.首选卷你能够确保实例在重启时不丢失数据.
        </p>
        <h3 className="short-bottom">
          临时卷
        </h3>
        <p>
          在您的容器中选择一个位置.
        </p>
        {this.getVolumesMountLines(data.volumeMounts, data.volumeMounts)}
        <div>
          <AddButton
            onClick={this.props.onAddItem.bind(this, {
              value: data.volumeMounts.length,
              path: "volumeMounts"
            })}
          >
            增加临时卷
          </AddButton>
        </div>
      </div>
    );
  }
}

MultiContainerVolumesFormSection.defaultProps = {
  data: {},
  errors: {},
  handleTabChange() {},
  onAddItem() {},
  onRemoveItem() {}
};

MultiContainerVolumesFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  handleTabChange: React.PropTypes.func,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func
};

MultiContainerVolumesFormSection.configReducers = {
  volumeMounts
};

module.exports = MultiContainerVolumesFormSection;
