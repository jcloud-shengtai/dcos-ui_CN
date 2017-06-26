import mixin from "reactjs-mixin";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import { StoreMixin } from "mesosphere-shared-reactjs";

import CosmosPackagesStore from "../../stores/CosmosPackagesStore";
import FormModal from "../FormModal";
import ModalHeading from "../modals/ModalHeading";
import ValidatorUtil from "../../utils/ValidatorUtil";

const METHODS_TO_BIND = [
  "handleAddRepository",
  "onCosmosPackagesStoreRepositoryAddError",
  "onCosmosPackagesStoreRepositoryAddSuccess",
  "resetState"
];

class AddRepositoryFormModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableButtons: false,
      errorMsg: null
    };

    this.store_listeners = [
      {
        name: "cosmosPackages",
        events: ["repositoryAddSuccess", "repositoryAddError"]
      }
    ];

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (props.open && !nextProps.open) {
      // Closes, reset state
      this.resetState();
    }
  }

  onCosmosPackagesStoreRepositoryAddError(errorMsg) {
    this.setState({ disableButtons: false, errorMsg });
  }

  onCosmosPackagesStoreRepositoryAddSuccess() {
    CosmosPackagesStore.fetchRepositories();
    this.props.onClose();
  }

  handleAddRepository(model) {
    CosmosPackagesStore.addRepository(model.name, model.uri, model.priority);
    this.resetState();
  }

  getAddRepositoryFormDefinition() {
    const { numberOfRepositories } = this.props;

    return [
      {
        fieldType: "text",
        name: "name",
        placeholder: "库名称",
        required: true,
        showError: false,
        showLabel: false,
        writeType: "input",
        validation() {
          return true;
        },
        value: ""
      },
      {
        fieldType: "text",
        name: "uri",
        placeholder: "网址",
        required: true,
        validationErrorText: "必须是包含http:// 或者 https:// 的合法网址。",
        showLabel: false,
        writeType: "input",
        validation: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/,
        value: ""
      },
      {
        fieldType: "number",
        name: "priority",
        placeholder: "优先级",
        required: false,
        min: "0",
        max: `${numberOfRepositories}`,
        step: "1",
        validationErrorText: `必须是 0 到 ${numberOfRepositories} 之间的正整数, 表示其优先级。0 表示最高优先级， ${numberOfRepositories} 表示最低优先级。`,
        showLabel: false,
        writeType: "input",
        validation(value) {
          return (
            ValidatorUtil.isDefined(value) &&
            ValidatorUtil.isNumberInRange(value, { max: numberOfRepositories })
          );
        },
        value: ""
      }
    ];
  }

  getButtonDefinition() {
    return [
      {
        text: "关闭",
        className: "button button-medium",
        isClose: true
      },
      {
        text: "添加",
        className: "button button-success button-medium",
        isSubmit: true
      }
    ];
  }

  getErrorMessage() {
    const { errorMsg } = this.state;
    if (!errorMsg) {
      return null;
    }

    return (
      <h4 className="text-align-center text-danger flush-top">{errorMsg}</h4>
    );
  }

  resetState() {
    this.setState({ errorMsg: null, disableButtons: false });
  }

  render() {
    const { props, state } = this;

    return (
      <FormModal
        definition={this.getAddRepositoryFormDefinition()}
        disabled={state.disableButtons}
        buttonDefinition={this.getButtonDefinition()}
        modalProps={{
          header: <ModalHeading>添加存储库</ModalHeading>,
          showHeader: true
        }}
        onChange={this.resetState}
        onClose={props.onClose}
        onSubmit={this.handleAddRepository}
        open={props.open}
      >
        {this.getErrorMessage()}
      </FormModal>
    );
  }
}

AddRepositoryFormModal.propTypes = {
  numberOfRepositories: React.PropTypes.number.isRequired,
  open: React.PropTypes.bool
};

module.exports = AddRepositoryFormModal;
