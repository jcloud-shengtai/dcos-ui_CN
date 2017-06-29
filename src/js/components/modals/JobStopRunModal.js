import { Confirm } from "reactjs-components";
import mixin from "reactjs-mixin";
import React from "react";
import { StoreMixin } from "mesosphere-shared-reactjs";

import MetronomeStore from "../../stores/MetronomeStore";
import ModalHeading from "../modals/ModalHeading";

const METHODS_TO_BIND = ["handleButtonConfirm"];

class JobStopRunModal extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: "metronome",
        events: ["jobStopRunSuccess", "jobStopRunError"],
        suppressUpdate: true
      }
    ];

    this.state = {
      pendingRequest: false
    };

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  handleButtonConfirm() {
    const { selectedItems, jobID } = this.props;
    // TODO DCOS-8763 introduce support for multiple job run IDs
    if (selectedItems.length === 1) {
      MetronomeStore.stopJobRun(jobID, selectedItems[0]);
    }

    this.setState({ pendingRequest: true });
  }

  onMetronomeStoreJobStopRunSuccess() {
    this.setState({ pendingRequest: false });
    this.props.onClose();
    this.props.onSuccess();
  }

  onMetronomeStoreJobStopRunError() {
    this.props.onClose();
  }

  getContentHeader(selectedItems, selectedItemsLength) {
    let headerContent = ` ${selectedItemsLength} 任务`;
    if (selectedItemsLength === 1) {
      headerContent = "这个任务";
    }

    return (
      <ModalHeading key="confirmHeader">
        {`确定要停止${headerContent}?`}
      </ModalHeading>
    );
  }

  getConfirmTextBody(selectedItems, selectedItemsLength) {
    let bodyText;

    if (selectedItemsLength === 1) {
      bodyText = `id为 ${selectedItems[0]}的任务`;
    } else {
      bodyText = "已选择的任务";
    }

    return (
      <span key="confirmText">
        {bodyText}将会停止。
      </span>
    );
  }

  getModalContents() {
    const { selectedItems } = this.props;
    const selectedItemsLength = selectedItems.length;

    return (
      <div className="text-align-center">
        {this.getConfirmTextBody(selectedItems, selectedItemsLength)}
      </div>
    );
  }

  render() {
    const { onClose, open, selectedItems } = this.props;
    let rightButtonText = "停止运行中的任务";
    const selectedItemsLength = selectedItems.length;

    if (selectedItems.length > 1) {
      rightButtonText = "停止运行中的任务";
    }

    return (
      <Confirm
        closeByBackdropClick={true}
        disabled={this.state.pendingRequest}
        header={this.getContentHeader(selectedItems, selectedItemsLength)}
        open={open}
        onClose={onClose}
        leftButtonText="关闭"
        leftButtonCallback={onClose}
        rightButtonText={rightButtonText}
        rightButtonClassName="button button-danger"
        rightButtonCallback={this.handleButtonConfirm}
        showHeader={true}
      >
        {this.getModalContents()}
      </Confirm>
    );
  }
}

JobStopRunModal.defaultProps = {
  onSuccess() {}
};

JobStopRunModal.propTypes = {
  jobID: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onSuccess: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
  selectedItems: React.PropTypes.array.isRequired
};

module.exports = JobStopRunModal;
