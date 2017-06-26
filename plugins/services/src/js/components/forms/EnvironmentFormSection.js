import { Tooltip } from "reactjs-components";
import { MountService } from "foundation-ui";
import React, { Component } from "react";

import {
  FormReducer as env
} from "../../reducers/serviceForm/EnvironmentVariables";
import { FormReducer as labels } from "../../reducers/serviceForm/Labels";
import AddButton from "../../../../../../src/js/components/form/AddButton";
import DeleteRowButton
  from "../../../../../../src/js/components/form/DeleteRowButton";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormGroupHeading
  from "../../../../../../src/js/components/form/FormGroupHeading";
import FormGroupHeadingContent
  from "../../../../../../src/js/components/form/FormGroupHeadingContent";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import Icon from "../../../../../../src/js/components/Icon";
import MetadataStore from "../../../../../../src/js/stores/MetadataStore";

class EnvironmentFormSection extends Component {
  getEnvironmentLines(data) {
    const errors = this.props.errors.env || {};

    return data
      .filter(function(item) {
        return item.value == null || typeof item.value === "string";
      })
      .map((env, key) => {
        let keyLabel = null;
        let valueLabel = null;
        if (key === 0) {
          keyLabel = (
            <FieldLabel>
              <FormGroupHeading>
                <FormGroupHeadingContent primary={true}>
                  键
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
          );
          valueLabel = (
            <FieldLabel>
              <FormGroupHeading>
                <FormGroupHeadingContent primary={true}>
                  值
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
          );
        }

        return (
          <FormRow key={key}>
            <FormGroup className="column-6" required={false}>
              {keyLabel}
              <FieldInput name={`env.${key}.key`} type="text" value={env.key} />
              <span className="emphasis form-colon">:</span>
            </FormGroup>
            <FormGroup
              className="column-6"
              required={false}
              showError={Boolean(errors[env.key])}
            >
              {valueLabel}
              <FieldInput
                name={`env.${key}.value`}
                type="text"
                value={env.value}
              />
              <FieldError>{errors[env.key]}</FieldError>
            </FormGroup>
            <FormGroup className="flex flex-item-align-end column-auto flush-left">
              <DeleteRowButton
                onClick={this.props.onRemoveItem.bind(this, {
                  value: key,
                  path: "env"
                })}
              />
            </FormGroup>
          </FormRow>
        );
      });
  }

  getLabelsLines(data) {
    const errors = this.props.errors.labels || {};

    return data.map((label, key) => {
      let keyLabel = null;
      let valueLabel = null;
      if (key === 0) {
        keyLabel = (
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                键
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
        );
        valueLabel = (
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                值
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
        );
      }

      return (
        <FormRow key={key}>
          <FormGroup className="column-6">
            {keyLabel}
            <FieldInput
              name={`labels.${key}.key`}
              type="text"
              value={label.key}
            />
            <span className="emphasis form-colon">:</span>
          </FormGroup>
          <FormGroup
            className="column-6"
            required={false}
            showError={Boolean(errors[label.key])}
          >
            {valueLabel}
            <FieldInput
              name={`labels.${key}.value`}
              type="text"
              value={label.value}
            />
            <FieldError>{errors[label.key]}</FieldError>
          </FormGroup>
          <FormGroup className="flex flex-item-align-end column-auto flush-left">
            <DeleteRowButton
              onClick={this.props.onRemoveItem.bind(this, {
                value: key,
                path: "labels"
              })}
            />
          </FormGroup>
        </FormRow>
      );
    });
  }

  render() {
    const { data, errors } = this.props;

    const envTooltipContent = (
      <span>
        {
          "DC/OS 也可以暴露环境变量和元数据. "
        }
        <a
          href="https://mesosphere.github.io/marathon/docs/task-environment-vars.html"
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );
    const labelsTooltipContent = (
      <span>
        {
          "例如, 您可以给服务打上 “staging” 和 “production” 的标签来进行标记. "
        }
        <a
          href={MetadataStore.buildDocsURI("/usage/tutorials/task-labels/")}
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <div>
        <h2 className="flush-top short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              环境
            </FormGroupHeadingContent>
          </FormGroupHeading>
        </h2>
        <p>
          为每个已启动的实例配置环境变量信息
        </p>
        <h3 className="short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              环境变量
            </FormGroupHeadingContent>
            <FormGroupHeadingContent>
              <Tooltip
                content={envTooltipContent}
                interactive={true}
                maxWidth={300}
                scrollContainer=".gm-scroll-view"
                wrapText={true}
              >
                <Icon color="grey" id="circle-question" size="mini" />
              </Tooltip>
            </FormGroupHeadingContent>
          </FormGroupHeading>
        </h3>
        <p>
          为你的服务的每个实例设置环境变量
        </p>
        {this.getEnvironmentLines(data.env)}
        <FormRow>
          <FormGroup className="column-12">
            <AddButton
              onClick={this.props.onAddItem.bind(this, {
                value: data.env.length,
                path: "env"
              })}
            >
              增加环境变量
            </AddButton>
          </FormGroup>
        </FormRow>
        <h3 className="short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              标签
            </FormGroupHeadingContent>
            <FormGroupHeadingContent>
              <Tooltip
                content={labelsTooltipContent}
                interactive={true}
                maxWidth={300}
                scrollContainer=".gm-scroll-view"
                wrapText={true}
              >
                <Icon color="grey" id="circle-question" size="mini" />
              </Tooltip>
            </FormGroupHeadingContent>
          </FormGroupHeading>
        </h3>
        <p>
          附加元数据以向其他服务公开其他信息.
        </p>
        {this.getLabelsLines(data.labels)}
        <FormRow>
          <FormGroup className="column-12">
            <AddButton
              onClick={this.props.onAddItem.bind(this, {
                value: data.labels.length,
                path: "labels"
              })}
            >
              增加标签
            </AddButton>
          </FormGroup>
        </FormRow>
        <MountService.Mount
          type={this.props.mountType}
          data={data}
          errors={errors}
          onAddItem={this.props.onAddItem.bind(this)}
          onRemoveItem={this.props.onRemoveItem.bind(this)}
        />
      </div>
    );
  }
}

EnvironmentFormSection.defaultProps = {
  data: {},
  errors: {},
  onAddItem() {},
  onRemoveItem() {},
  mountType: "CreateService:EnvironmentFormSection"
};

EnvironmentFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func,
  mountType: React.PropTypes.string
};

EnvironmentFormSection.configReducers = {
  env,
  labels
};

module.exports = EnvironmentFormSection;
