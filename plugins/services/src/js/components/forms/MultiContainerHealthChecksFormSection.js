import React, { Component } from "react";
import { Tooltip } from "reactjs-components";
import Objektiv from "objektiv";

import AddButton from "../../../../../../src/js/components/form/AddButton";
import AdvancedSection
  from "../../../../../../src/js/components/form/AdvancedSection";
import AdvancedSectionContent
  from "../../../../../../src/js/components/form/AdvancedSectionContent";
import AdvancedSectionLabel
  from "../../../../../../src/js/components/form/AdvancedSectionLabel";
import FieldError from "../../../../../../src/js/components/form/FieldError";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FieldLabel from "../../../../../../src/js/components/form/FieldLabel";
import FieldSelect from "../../../../../../src/js/components/form/FieldSelect";
import FieldTextarea
  from "../../../../../../src/js/components/form/FieldTextarea";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormGroupContainer
  from "../../../../../../src/js/components/form/FormGroupContainer";
import FormGroupHeading
  from "../../../../../../src/js/components/form/FormGroupHeading";
import FormGroupHeadingContent
  from "../../../../../../src/js/components/form/FormGroupHeadingContent";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import Icon from "../../../../../../src/js/components/Icon";
import { HTTP, TCP, COMMAND } from "../../constants/HealthCheckProtocols";

class MultiContainerHealthChecksFormSection extends Component {
  getAdvancedSettings(healthCheck, path, errorsLens) {
    const errors = errorsLens.get(this.props.errors);

    const gracePeriodHelpText = (
      <span>
        (Optional. Default: 300): Health check failures are ignored within this
        number of seconds or until the instance becomes healthy for the first
        time.
      </span>
    );

    const intervalHelpText = (
      <span>
        (Optional. Default: 60): Number of seconds to wait between health checks.
      </span>
    );

    const timeoutHelpText = (
      <span>
        (Optional. Default: 20): Number of seconds after which a health check
        is considered a failure regardless of the response.
      </span>
    );

    const failuresHelpText = (
      <span>
        (Optional. Default: 3): Number of consecutive health check failures
        after which the unhealthy instance should be killed. HTTP & TCP health
        checks: If this value is 0, instances will not be killed if they fail
        the health check.
      </span>
    );

    return (
      <AdvancedSection>
        <AdvancedSectionLabel>
          高级节点状态检查设置
        </AdvancedSectionLabel>
        <AdvancedSectionContent>
          <FormRow>
            <FormGroup
              className="column-3"
              showError={Boolean(errors.gracePeriodSeconds)}
            >
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    周期 (s)
                  </FormGroupHeadingContent>
                  <FormGroupHeadingContent>
                    <Tooltip
                      content={gracePeriodHelpText}
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
                name={`${path}.gracePeriodSeconds`}
                type="number"
                min="0"
                placeholder="300"
                value={healthCheck.gracePeriodSeconds}
              />
              <FieldError>{errors.gracePeriodSeconds}</FieldError>
            </FormGroup>
            <FormGroup
              className="column-3"
              showError={Boolean(errors.intervalSeconds)}
            >
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    间隔 (s)
                  </FormGroupHeadingContent>
                  <FormGroupHeadingContent>
                    <Tooltip
                      content={intervalHelpText}
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
                name={`${path}.intervalSeconds`}
                type="number"
                min="0"
                placeholder="60"
                value={healthCheck.intervalSeconds}
              />
              <FieldError>{errors.intervalSeconds}</FieldError>
            </FormGroup>
            <FormGroup
              className="column-3"
              showError={Boolean(errors.timeoutSeconds)}
            >
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    超时 (s)
                  </FormGroupHeadingContent>
                  <FormGroupHeadingContent>
                    <Tooltip
                      content={timeoutHelpText}
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
                name={`${path}.timeoutSeconds`}
                type="number"
                min="0"
                placeholder="20"
                value={healthCheck.timeoutSeconds}
              />
              <FieldError>{errors.timeoutSeconds}</FieldError>
            </FormGroup>
            <FormGroup
              className="column-3"
              showError={Boolean(errors.maxConsecutiveFailures)}
            >
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    最大失败次数
                  </FormGroupHeadingContent>
                  <FormGroupHeadingContent>
                    <Tooltip
                      content={failuresHelpText}
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
                name={`${path}.maxConsecutiveFailures`}
                type="number"
                min="0"
                placeholder="3"
                value={healthCheck.maxConsecutiveFailures}
              />
              <FieldError>{errors.maxConsecutiveFailures}</FieldError>
            </FormGroup>
          </FormRow>
        </AdvancedSectionContent>
      </AdvancedSection>
    );
  }

  getCommandFields(healthCheck, path, errorsLens) {
    if (healthCheck.protocol !== COMMAND) {
      return null;
    }

    const { exec } = healthCheck;
    const errors = errorsLens
      .attr("exec", {})
      .attr("command", {})
      .get(this.props.errors);

    return (
      <FormRow>
        <FormGroup
          className="column-12"
          showError={Boolean(errors.shell || errors.argv)}
        >
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                命令
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldTextarea
            name={`${path}.exec.command.value`}
            type="text"
            value={exec && exec.command.value}
          />
          <FieldError>{errors.shell || errors.argv}</FieldError>
        </FormGroup>
      </FormRow>
    );
  }

  getEndpoints(container) {
    if (container.endpoints == null) {
      return [];
    }

    return container.endpoints.map(endpoint => {
      return (
        <option key={endpoint} value={endpoint.name}>
          {endpoint.name}
        </option>
      );
    });
  }

  getHTTPFields(healthCheck, container, path, errorsLens) {
    if (healthCheck.protocol !== HTTP) {
      return null;
    }

    const errors = errorsLens.at("http", {}).get(this.props.errors);

    const endpointHelpText = (
      <span>选择一个您在网络中配置好的服务端点.</span>
    );
    const pathHelpText = (
      <span>
        输入一个可以访问到你的服务的地址以及期望的响应代码（200-399）.
      </span>
    );

    return [
      <FormRow key="path">
        <FormGroup className="column-6" showError={false}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                Service Endpoint
              </FormGroupHeadingContent>
              <FormGroupHeadingContent>
                <Tooltip
                  content={endpointHelpText}
                  interactive={true}
                  maxWidth={300}
                  scrollContainer=".gm-scroll-view"
                  wrapperClassName="tooltip-wrapper tooltip-block-wrapper text-align-center"
                  wrapText={true}
                >
                  <Icon color="grey" id="circle-question" size="mini" />
                </Tooltip>
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldSelect
            name={`${path}.http.endpoint`}
            value={String(healthCheck.http.endpoint)}
          >
            <option value="">选择端点</option>
            {this.getEndpoints(container)}
          </FieldSelect>
        </FormGroup>
        <FormGroup className="column-6" showError={Boolean(errors.path)}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                路径
              </FormGroupHeadingContent>
              <FormGroupHeadingContent>
                <Tooltip
                  content={pathHelpText}
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
            name={`${path}.http.path`}
            type="text"
            value={healthCheck.http.path}
          />
          <FieldError>{errors.path}</FieldError>
        </FormGroup>
      </FormRow>,
      <FormRow key="HTTPS">
        <FormGroup showError={false} className="column-12">
          <FieldLabel>
            <FieldInput
              checked={healthCheck.http.https}
              name={`${path}.http.https`}
              type="checkbox"
            />
            使用https
          </FieldLabel>
          <FieldError>{errors.protocol}</FieldError>
        </FormGroup>
      </FormRow>
    ];
  }

  getTCPFields(healthCheck, container, path) {
    if (healthCheck.protocol !== TCP) {
      return null;
    }

    return (
      <FormRow key="path">
        <FormGroup className="column-12" showError={false}>
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                服务端点
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldSelect
            name={`${path}.tcp.endpoint`}
            value={String(healthCheck.tcp.endpoint)}
          >
            <option value="">Select Endpoint</option>
            {this.getEndpoints(container)}
          </FieldSelect>
        </FormGroup>
      </FormRow>
    );
  }

  getHealthChecksBody(container, index) {
    const { healthCheck } = container;
    const path = `containers.${index}.healthCheck`;
    const errorsLens = Objektiv.attr("containers", [])
      .at(index, {})
      .attr("healthCheck", {});

    if (healthCheck == null) {
      return (
        <div>
          <AddButton
            onClick={this.props.onAddItem.bind(this, { path, value: index })}
          >
            增加健康检查
          </AddButton>
        </div>
      );
    }

    const tooltipContent = (
      <span>
        {"您可以从多个协议选项中选择. "}
        <a
          href="https://mesosphere.github.io/marathon/docs/health-checks.html"
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );

    return (
      <FormGroupContainer
        onRemove={this.props.onRemoveItem.bind(this, { path })}
      >
        <FormRow>
          <FormGroup className="column-6">
            <FieldLabel>
              <FormGroupHeading>
                <FormGroupHeadingContent primary={true}>
                  协议
                </FormGroupHeadingContent>
                <FormGroupHeadingContent>
                  <Tooltip
                    content={tooltipContent}
                    interactive={true}
                    maxWidth={300}
                    scrollContainer=".gm-scroll-view"
                    wrapperClassName="tooltip-wrapper text-align-center"
                    wrapText={true}
                  >
                    <Icon color="grey" id="circle-question" size="mini" />
                  </Tooltip>
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
            <FieldSelect name={`${path}.protocol`} value={healthCheck.protocol}>
              <option value="">Select Protocol</option>
              <option value={COMMAND}>Command</option>
              <option value={HTTP}>HTTP</option>
              <option value={TCP}>TCP</option>
            </FieldSelect>
          </FormGroup>
        </FormRow>
        {this.getHTTPFields(healthCheck, container, path, errorsLens)}
        {this.getTCPFields(healthCheck, container, path)}
        {this.getCommandFields(healthCheck, path, errorsLens)}
        {this.getAdvancedSettings(healthCheck, path, errorsLens)}
      </FormGroupContainer>
    );
  }

  getContainerHealthChecks(containers) {
    return containers.map((container, index) => {
      return (
        <div key={container.name}>
          <div className="form-row-element">
            <h4 className="form-header short-bottom">
              <FormGroupHeading>
                <FormGroupHeadingContent>
                  <Icon id="container" size="mini" color="#2f81f7" />
                </FormGroupHeadingContent>
                <FormGroupHeadingContent primary={true}>
                  {container.name}
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </h4>
          </div>
          {this.getHealthChecksBody(container, index)}
        </div>
      );
    });
  }

  render() {
    const { data, handleTabChange } = this.props;
    const tooltipContent = (
      <span>
        {`节点状态检查在满足以下条件时通过 (1) 响应码在 200 到 399 之间, (2) 在超时前返回全部响应内容. `}
        <a
          href="https://mesosphere.github.io/marathon/docs/health-checks.html"
          target="_blank"
        >
          更多信息
        </a>.
      </span>
    );
    const heading = (
      <FormGroupHeading>
        <FormGroupHeadingContent primary={true}>
          节点状态检查
        </FormGroupHeadingContent>
        <FormGroupHeadingContent>
          <Tooltip
            content={tooltipContent}
            interactive={true}
            maxWidth={300}
            scrollContainer=".gm-scroll-view"
            wrapperClassName="tooltip-wrapper text-align-center"
            wrapText={true}
          >
            <Icon color="grey" id="circle-question" size="mini" />
          </Tooltip>
        </FormGroupHeadingContent>
      </FormGroupHeading>
    );

    if (!data.containers || !data.containers.length) {
      return (
        <div>
          <h2 className="flush-top short-bottom">
            {heading}
          </h2>
          <p>
            {"请在配置节点状态检查前先 "}
            <a
              onClick={handleTabChange.bind(null, "services")}
              className="clickable"
            >
              添加一个容器
            </a>
            {"."}
          </p>
        </div>
      );
    }

    return (
      <div className="form flush-bottom">
        <h2 className="form-header flush-top short-bottom">
          {heading}
        </h2>
        <p>
          可以针对应用程序的实例为每个应用程序指定运行状况检查。
        </p>
        {this.getContainerHealthChecks(data.containers)}
      </div>
    );
  }
}

MultiContainerHealthChecksFormSection.defaultProps = {
  data: {},
  errors: {},
  handleTabChange() {},
  onAddItem() {},
  onRemoveItem() {}
};

MultiContainerHealthChecksFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  handleTabChange: React.PropTypes.func,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func
};

module.exports = MultiContainerHealthChecksFormSection;
