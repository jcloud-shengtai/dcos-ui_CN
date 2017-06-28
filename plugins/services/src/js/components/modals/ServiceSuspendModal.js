import { Confirm } from "reactjs-components";
import React, { PropTypes } from "react";
import PureRender from "react-addons-pure-render-mixin";

import AppLockedMessage from "./AppLockedMessage";
import ModalHeading
  from "../../../../../../src/js/components/modals/ModalHeading";
import Pod from "../../structs/Pod";
import Service from "../../structs/Service";
import ServiceTree from "../../structs/ServiceTree";

class ServiceSuspendModal extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      errorMsg: null
    };

    this.shouldComponentUpdate = PureRender.shouldComponentUpdate.bind(this);
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

  shouldForceUpdate() {
    return this.state.errorMsg && /force=true/.test(this.state.errorMsg);
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

  render() {
    const { isPending, onClose, open, service, suspendItem } = this.props;

    let itemText = "服务";
    let serviceName = "";

    if (service instanceof Pod) {
      itemText = "Pod";
    }

    if (service instanceof ServiceTree) {
      itemText = "分组";
    }

    if (service) {
      serviceName = service.getId();
    }

    const heading = (
      <ModalHeading>
        暂停{itemText}
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
        rightButtonText={`暂停${itemText}`}
        rightButtonCallback={() => suspendItem(this.shouldForceUpdate())}
        showHeader={true}
      >
        <p>
          确定通过扩展到 0 个实例的方式暂停服务
          {" "}
          <span className="emphasize">{serviceName}</span>
          {" "}
          ?
        </p>
        {this.getErrorMessage()}
      </Confirm>
    );
  }
}

ServiceSuspendModal.propTypes = {
  suspendItem: PropTypes.func.isRequired,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isPending: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  service: PropTypes.oneOfType([
    PropTypes.instanceOf(ServiceTree),
    PropTypes.instanceOf(Service)
  ]).isRequired
};

module.exports = ServiceSuspendModal;
