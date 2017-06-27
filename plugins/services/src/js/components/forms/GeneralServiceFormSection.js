import classNames from "classnames";
import React, { Component } from "react";
import { Confirm, Tooltip } from "reactjs-components";

import {
  findNestedPropertyInObject
} from "../../../../../../src/js/utils/Util";
import { pluralize } from "../../../../../../src/js/utils/StringUtil";
import AddButton from "../../../../../../src/js/components/form/AddButton";
import AdvancedSection
  from "../../../../../../src/js/components/form/AdvancedSection";
import AdvancedSectionContent
  from "../../../../../../src/js/components/form/AdvancedSectionContent";
import AdvancedSectionLabel
  from "../../../../../../src/js/components/form/AdvancedSectionLabel";
import ContainerConstants from "../../constants/ContainerConstants";
import ContainerServiceFormSection from "./ContainerServiceFormSection";
import ContainerServiceFormAdvancedSection
  from "./ContainerServiceFormAdvancedSection";
import DeleteRowButton
  from "../../../../../../src/js/components/form/DeleteRowButton";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldHelp from "../../../../../../src/js/components/form/FieldHelp";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
import FieldSelect from "../../../../../../src/js/components/form/FieldSelect";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormGroupHeading
  from "../../../../../../src/js/components/form/FormGroupHeading";
import FormGroupHeadingContent
  from "../../../../../../src/js/components/form/FormGroupHeadingContent";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import FormGroupContainer
  from "../../../../../../src/js/components/form/FormGroupContainer";
import General from "../../reducers/serviceForm/General";
import ModalHeading
  from "../../../../../../src/js/components/modals/ModalHeading";
import OperatorTypes from "../../constants/OperatorTypes";
import PlacementConstraintsUtil from "../../utils/PlacementConstraintsUtil";
import PodSpec from "../../structs/PodSpec";
import Icon from "../../../../../../src/js/components/Icon";
import MetadataStore from "../../../../../../src/js/stores/MetadataStore";
import { isEmpty } from "../../../../../../src/js/utils/ValidatorUtil";

const { type: { MESOS, DOCKER, NONE }, labelMap } = ContainerConstants;

const METHODS_TO_BIND = [
  "handleConvertToPod",
  "handleCloseConvertToPodModal",
  "handleOpenConvertToPodModal"
];

const containerRuntimes = {
  [DOCKER]: {
    label: <span>{labelMap[DOCKER]}</span>,
    helpText: "Docker’s 容器. 不支持多容器(Pods) 或 GPU 资源."
  },
  [NONE]: {
    label: <span>{labelMap[NONE]}</span>,
    helpText: "默认的 Mesos 容器"
  },
  [MESOS]: {
    label: <span>{labelMap[MESOS]}</span>,
    helpText: "Mesos 的原生容器引擎，具备标准版Linux特征. 支持 Docker 文件格式,多实例 (Pods) 和 GPU 资源."
  }
};

function placementConstraintLabel(name, tooltipText, options = {}) {
  const { isRequired = false, linkText = "More information" } = options;

  const tooltipContent = (
    <span>
      {`${tooltipText} `}
      <a
        href="https://mesosphere.github.io/marathon/docs/constraints.html"
        target="_blank"
      >
        {linkText}
      </a>.
    </span>
  );

  return (
    <FieldLabel>
      <FormGroupHeading required={isRequired}>
        <FormGroupHeadingContent primary={true}>
          {name}
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
  );
}

class GeneralServiceFormSection extends Component {
  constructor() {
    super(...arguments);

    this.state = { convertToPodModalOpen: false };

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  handleConvertToPod() {
    this.props.onConvertToPod();
    this.handleCloseConvertToPodModal();
  }

  handleCloseConvertToPodModal() {
    this.setState({ convertToPodModalOpen: false });
  }

  handleOpenConvertToPodModal() {
    this.setState({ convertToPodModalOpen: true });
  }

  getAdvancedContainerSection() {
    const { data = {}, errors, service } = this.props;

    if (service instanceof PodSpec) {
      return null;
    }

    return (
      <ContainerServiceFormAdvancedSection
        data={data}
        errors={errors}
        onAddItem={this.props.onAddItem}
        onRemoveItem={this.props.onRemoveItem}
        path="container"
        service={service}
      />
    );
  }

  getContainerSection() {
    const { data = {}, errors, service } = this.props;

    if (service instanceof PodSpec) {
      return null;
    }

    return (
      <ContainerServiceFormSection
        data={data}
        errors={errors}
        onAddItem={this.props.onAddItem}
        onRemoveItem={this.props.onRemoveItem}
        path="container"
        service={service}
      />
    );
  }

  getConvertToPodAction() {
    const { service, isEdit } = this.props;

    if (isEdit || service instanceof PodSpec) {
      return null;
    }

    return (
      <div className="pod pod-short flush-horizontal flush-bottom">
        <em>
          {"需要启动多容器服务? "}
          <a className="clickable" onClick={this.handleOpenConvertToPodModal}>
            添加另一个容器
          </a>.
        </em>
      </div>
    );
  }

  getMultiContainerSection() {
    const { data = {}, service } = this.props;
    if (!(service instanceof PodSpec)) {
      return null;
    }

    const { containers = [] } = data;
    const containerElements = containers.map((item, index) => {
      return (
        <FormGroupContainer
          key={index}
          onRemove={this.props.onRemoveItem.bind(this, {
            value: index,
            path: "containers"
          })}
        >
          {item.name || `container-${index + 1}`}
        </FormGroupContainer>
      );
    });

    return (
      <div>
        <h3 className="short-bottom">
          容器
        </h3>
        {containerElements}
        <AddButton
          onClick={this.props.onAddItem.bind(this, {
            value: 0,
            path: "containers"
          })}
        >
          添加容器
        </AddButton>
      </div>
    );
  }

  getOperatorTypes() {
    return Object.keys(OperatorTypes).map((type, index) => {
      return <option key={index} value={type}>{type}</option>;
    });
  }

  getPlacementconstraints() {
    const { data = {} } = this.props;
    const constraintsErrors = findNestedPropertyInObject(
      this.props.errors,
      "constraints"
    );
    let errorNode = null;
    const placementTooltipContent = (
      <span>
        {
          "约束有三部分: a field name, an operator, and an optional parameter. The field can be the hostname of the agent node or any attribute of the agent node. "
        }
        <a
          href="https://mesosphere.github.io/marathon/docs/constraints.html"
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );
    const hasErrors =
      constraintsErrors != null && !Array.isArray(constraintsErrors);

    if (hasErrors) {
      errorNode = (
        <FormGroup showError={hasErrors}>
          <FieldError>
            {constraintsErrors}
          </FieldError>
        </FormGroup>
      );
    }

    return (
      <div>
        <h3 className="short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              Placement 约束
            </FormGroupHeadingContent>
            <FormGroupHeadingContent>
              <Tooltip
                content={placementTooltipContent}
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
          Constraints control where apps run to allow optimization for either fault tolerance or locality.
        </p>
        {this.getPlacementConstraintsFields(data.constraints)}
        {errorNode}
        <FormRow>
          <FormGroup className="column-12">
            <AddButton
              onClick={this.props.onAddItem.bind(this, {
                value: data.constraints.length,
                path: "constraints"
              })}
            >
              添加 Placement 约束
            </AddButton>
          </FormGroup>
        </FormRow>
      </div>
    );
  }

  getPlacementConstraintsFields(data = []) {
    const constraintsErrors = findNestedPropertyInObject(
      this.props.errors,
      "constraints"
    );
    const hasOneRequiredValue = data.some(function(constraint) {
      return PlacementConstraintsUtil.requiresValue(constraint.operator);
    });
    const hideValueColumn = data.every(function(constraint) {
      return PlacementConstraintsUtil.requiresEmptyValue(constraint.operator);
    });

    return data.map((constraint, index) => {
      let fieldLabel = null;
      let operatorLabel = null;
      let valueLabel = null;
      const valueIsRequired = PlacementConstraintsUtil.requiresValue(
        constraint.operator
      );
      const valueIsRequiredEmpty = PlacementConstraintsUtil.requiresEmptyValue(
        constraint.operator
      );
      const fieldNameError = findNestedPropertyInObject(
        constraintsErrors,
        `${index}.fieldName`
      );
      const operatorError = findNestedPropertyInObject(
        constraintsErrors,
        `${index}.operator`
      );
      const valueError = findNestedPropertyInObject(
        constraintsErrors,
        `${index}.value`
      );
      const commonFieldsClassNames = {
        "column-4": !hideValueColumn,
        "column-6": hideValueColumn
      };
      const deleteRowButtonClassNames = classNames("column-2 flush-left", {
        "form-group-without-top-label": index === 0
      });

      if (index === 0) {
        fieldLabel = placementConstraintLabel(
          "字段",
          "如果你输入 `hostname`, 约束将会映射到 代理节点 hostname上. 如果你没有输入一个hostname的代理节点, 相关字段就会被当做一个 Mesos 代理节点的属性, 以允许您标记代理节点.",
          { isRequired: true }
        );
        operatorLabel = placementConstraintLabel(
          "Operator",
          "Operators制定了你的应用可以在哪里运行.",
          { isRequired: true }
        );
      }
      if (index === 0 && !hideValueColumn) {
        valueLabel = placementConstraintLabel(
          "Value",
          "Values 允许您在将来指定您的约束.",
          { linkText: "了解更多", isRequired: hasOneRequiredValue }
        );
      }

      return (
        <FormRow key={index}>
          <FormGroup
            className={commonFieldsClassNames}
            required={true}
            showError={Boolean(fieldNameError)}
          >
            {fieldLabel}
            <FieldInput
              name={`constraints.${index}.fieldName`}
              type="text"
              placeholer="主机名"
              value={constraint.fieldName}
            />
            <FieldError>{fieldNameError}</FieldError>
          </FormGroup>
          <FormGroup
            className={commonFieldsClassNames}
            required={true}
            showError={Boolean(operatorError)}
          >
            {operatorLabel}
            <FieldSelect
              name={`constraints.${index}.operator`}
              type="text"
              value={String(constraint.operator)}
            >
              <option value="">Select</option>
              {this.getOperatorTypes()}
            </FieldSelect>
            <FieldError>{operatorError}</FieldError>
          </FormGroup>
          <FormGroup
            className={{
              "column-4": !hideValueColumn,
              hidden: hideValueColumn
            }}
            required={valueIsRequired}
            showError={Boolean(valueError)}
          >
            {valueLabel}
            <FieldInput
              className={{ hidden: valueIsRequiredEmpty }}
              name={`constraints.${index}.value`}
              type="text"
              value={constraint.value}
            />
            <FieldHelp
              className={{ hidden: valueIsRequired || valueIsRequiredEmpty }}
            >
              这个字段是可选的
            </FieldHelp>
            <FieldError className={{ hidden: hideValueColumn }}>
              {valueError}
            </FieldError>
          </FormGroup>

          <FormGroup className={deleteRowButtonClassNames}>
            <DeleteRowButton
              onClick={this.props.onRemoveItem.bind(this, {
                value: index,
                path: "constraints"
              })}
            />
          </FormGroup>
        </FormRow>
      );
    });
  }

  getRuntimeSection() {
    const { errors, service, data } = this.props;
    if (service instanceof PodSpec) {
      return null;
    }

    const typeErrors = findNestedPropertyInObject(errors, "container.type");
    const runtimeTooltipContent = (
      <span>
        {
          "两种容器运行时环境都可以运行docker容器. DC/OS对Universal 容器 有着更好的支持 . "
        }
        <a
          href={MetadataStore.buildDocsURI("/usage/containerizers/")}
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <div>
        <h3 className="short-bottom">
          <FormGroupHeading>
            <FormGroupHeadingContent primary={true}>
              容器运行时
            </FormGroupHeadingContent>
            <FormGroupHeadingContent>
              <Tooltip
                content={runtimeTooltipContent}
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
          容器运行时环境可以运行您的服务. 我们同时支持Mesos容器和Docker容器.
        </p>
        <FormGroup showError={Boolean(typeErrors)}>
          {this.getRuntimeSelections(data)}
          <FieldError>{typeErrors}</FieldError>
        </FormGroup>
      </div>
    );
  }

  getRuntimeSelections() {
    const { data = {} } = this.props;
    const { container = {}, gpus } = data;
    const isDisabled = {};
    let disabledTooltipContent;
    let type = NONE;

    if (container != null && container.type != null) {
      type = container.type;
    }

    if (!isEmpty(gpus) && gpus !== 0) {
      isDisabled[DOCKER] = true;
      disabledTooltipContent =
        "Docker 引擎不支持 GPU 资源, 如果您想使用 GPU 资源，请选择 Universal.";
    }

    return Object.keys(containerRuntimes).map((runtimeName, index) => {
      const { helpText, label } = containerRuntimes[runtimeName];
      let field = (
        <FieldLabel className="text-align-left" key={index}>
          <FieldInput
            checked={Boolean(type === runtimeName)}
            disabled={isDisabled[runtimeName]}
            name="container.type"
            type="radio"
            value={runtimeName}
          />
          {label}
          <FieldHelp>{helpText}</FieldHelp>
        </FieldLabel>
      );

      // Wrap field in tooltip if disabled and content populated
      if (isDisabled[runtimeName] && disabledTooltipContent) {
        field = (
          <Tooltip
            content={disabledTooltipContent}
            interactive={true}
            key={index}
            maxWidth={300}
            scrollContainer=".gm-scroll-view"
            wrapText={true}
          >
            {field}
          </Tooltip>
        );
      }

      return field;
    });
  }

  shouldShowAdvancedOptions() {
    const { data, data: { container } } = this.props;
    const { docker } = container || {};

    return (
      !isEmpty(data.disk) ||
      !isEmpty(data.gpus) ||
      !isEmpty(data.constraints) ||
      !isEmpty(findNestedPropertyInObject(docker, "forcePullImage")) ||
      !isEmpty(findNestedPropertyInObject(docker, "image")) ||
      !isEmpty(findNestedPropertyInObject(docker, "privileged")) ||
      findNestedPropertyInObject(container, "type") !== DOCKER
    );
  }

  render() {
    const { data, errors } = this.props;
    const initialIsExpanded = this.shouldShowAdvancedOptions();
    const title = pluralize(
      "服务",
      findNestedPropertyInObject(data, "containers.length") || 1
    );

    const idTooltipContent = (
      <span>
        {
          "如果适用，请将路径包含于您的服务，例如 /dev/tools/my-service. "
        }
        <a
          href="https://mesosphere.github.io/marathon/docs/application-groups.html"
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <div>
        <h2 className="flush-top short-bottom">
          {title}
        </h2>
        <p>
          在下面配置您的服务，首先给您的服务指定一个ID。
        </p>

        <FormRow>
          <FormGroup className="column-9" showError={Boolean(errors.id)}>
            <FieldLabel>
              <FormGroupHeading required={true}>
                <FormGroupHeadingContent primary={true}>
                  服务 ID
                </FormGroupHeadingContent>
                <FormGroupHeadingContent>
                  <Tooltip
                    content={idTooltipContent}
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
            <FieldInput name="id" type="text" value={data.id} />
            <FieldHelp>
              给您的服务命名一个唯一的名称, e.g. my-service.
            </FieldHelp>
            <FieldError>{errors.id}</FieldError>
          </FormGroup>

          <FormGroup className="column-3" showError={Boolean(errors.instances)}>
            <FieldLabel>
              <FormGroupHeading>
                <FormGroupHeadingContent primary={true}>
                  实例
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
            <FieldInput
              name="instances"
              min={0}
              type="number"
              value={data.instances}
            />
            <FieldError>{errors.instances}</FieldError>
          </FormGroup>
        </FormRow>

        {this.getContainerSection()}

        <AdvancedSection initialIsExpanded={initialIsExpanded}>
          <AdvancedSectionLabel>
            更多设置
          </AdvancedSectionLabel>
          <AdvancedSectionContent>
            {this.getRuntimeSection()}
            {this.getPlacementconstraints()}
            {this.getAdvancedContainerSection()}
          </AdvancedSectionContent>
        </AdvancedSection>

        {this.getMultiContainerSection()}
        {this.getConvertToPodAction()}

        <Confirm
          closeByBackdropClick={true}
          header={<ModalHeading>转换为一个服务包</ModalHeading>}
          open={this.state.convertToPodModalOpen}
          onClose={this.handleCloseConvertToPodModal}
          leftButtonText="关闭"
          leftButtonCallback={this.handleCloseConvertToPodModal}
          rightButtonText="继续"
          rightButtonClassName="button button-success"
          rightButtonCallback={this.handleConvertToPod}
          showHeader={true}
        >
          <p>
            {
              "添加另一个容器会自动的将多个容器转换成一个Pod. 你的容器会被分配在相同节点，并一起应用扩展操作. "
            }
            <a
              href={MetadataStore.buildDocsURI("/usage/pods/")}
              target="_blank"
            >
              更多信息
            </a>.
          </p>
          <p>
            确定继续创建Pod? 任何您已输入但未保存的信息将会丢失.
          </p>
        </Confirm>
      </div>
    );
  }
}

GeneralServiceFormSection.defaultProps = {
  data: {},
  errors: {},
  onAddItem() {},
  onRemoveItem() {}
};

GeneralServiceFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func
};

GeneralServiceFormSection.configReducers = General;

module.exports = GeneralServiceFormSection;
