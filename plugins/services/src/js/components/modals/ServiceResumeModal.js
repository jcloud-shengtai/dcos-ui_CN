import { Confirm } from "reactjs-components";
import React, { PropTypes } from "react";
import PureRender from "react-addons-pure-render-mixin";

import AppLockedMessage from "./AppLockedMessage";
import FieldInput from "../../../../../../src/js/components/form/FieldInput";
import FormGroup from "../../../../../../src/js/components/form/FormGroup";
import FormRow from "../../../../../../src/js/components/form/FormRow";
import ModalHeading
  from "../../../../../../src/js/components/modals/ModalHeading";
import Service from "../../structs/Service";
import ServiceTree from "../../structs/ServiceTree";

const METHODS_TO_BIND = ["handleConfirmation", "handleInstancesFieldChange"];

class ServiceResumeModal extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      instancesFieldValue: null,
      errorMsg: null
    };

    this.shouldComponentUpdate = PureRender.shouldComponentUpdate.bind(this);

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillUpdate(nextProps) {
    const requestCompleted = this.props.isPending && !nextProps.isPending;
    const shouldClose = requestCompleted && !nextProps.errors;

    if (shouldClose) {
      this.props.onClose();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { errors } = nextProps;
    if (!errors) {
      this.setState({ errorMsg: null });

      return;
    }

    if (typeof errors === "string") {
      this.setState({ errorMsg: errors });

      return;
    }

    let { message: errorMsg = "", details } = errors;
    const hasDetails = details && details.length !== 0;

    if (hasDetails) {
      errorMsg = details.reduce(function(memo, error) {
        return `${memo} ${error.errors.join(" ")}`;
      }, "");
    }

    if (!errorMsg || !errorMsg.length) {
      errorMsg = null;
    }

    this.setState({ errorMsg });
  }

  handleConfirmation() {
    const instances = this.state.instancesFieldValue == null
      ? 1
      : this.state.instancesFieldValue;

    this.props.resumeService(instances, this.shouldForceUpdate());
  }

  handleInstancesFieldChange(event) {
    this.setState({
      instancesFieldValue: event.target.value
    });
  }

  getErrorMessage() {
    const { errorMsg = null } = this.state;

    if (!errorMsg) {
      return null;
    }

    if (this.shouldForceUpdate()) {
      return <AppLockedMessage service={this.props.service} />;
    }

    return (
      <h4 className="text-align-center text-danger flush-top">{errorMsg}</h4>
    );
  }

  getModalContent() {
    const { props: { service } } = this;

    if (service.getLabels().MARATHON_SINGLE_INSTANCE_APP) {
      return (
        <p>
          当前服务已暂停. 是否想要恢复?
        </p>
      );
    }

    return (
      <div>
        <p>
          该服务当前已被暂停. 您是否想要恢复该服务? 您可以通过指定数字来讲该服务扩展到指定个数的实例.
        </p>
        <FormRow>
          <FormGroup className="column-12 column-small-6 column-small-offset-3 flush-bottom">
            <FieldInput
              name="instances"
              onChange={this.handleInstancesFieldChange}
              type="number"
              value="1"
            />
          </FormGroup>
        </FormRow>
      </div>
    );
  }

  shouldForceUpdate() {
    return this.state.errorMsg && /force=true/.test(this.state.errorMsg);
  }

  render() {
    const { isPending, onClose, open } = this.props;

    const heading = (
      <ModalHeading>
        恢复服务
      </ModalHeading>
    );

    return (
      <Confirm
        disabled={isPending}
        header={heading}
        open={open}
        onClose={onClose}
        leftButtonText="取消"
        leftButtonCallback={onClose}
        rightButtonText="恢复服务"
        rightButtonClassName="button button-primary"
        rightButtonCallback={this.handleConfirmation}
        showHeader={true}
      >
        {this.getModalContent()}
        {this.getErrorMessage()}
      </Confirm>
    );
  }
}

ServiceResumeModal.propTypes = {
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isPending: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  resumeService: PropTypes.func.isRequired,
  service: PropTypes.oneOfType([
    PropTypes.instanceOf(ServiceTree),
    PropTypes.instanceOf(Service)
  ]).isRequired
};

module.exports = ServiceResumeModal;
