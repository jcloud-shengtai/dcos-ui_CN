import ContainerConstants from "../constants/ContainerConstants";
import ValidatorUtil from "../../../../../src/js/utils/ValidatorUtil";
import { findNestedPropertyInObject } from "../../../../../src/js/utils/Util";
import {
  PROP_CONFLICT,
  PROP_DEPRECATED,
  PROP_MISSING_ALL,
  PROP_MISSING_ONE,
  SYNTAX_ERROR
} from "../constants/ServiceErrorTypes";
import PlacementConstraintsUtil from "../utils/PlacementConstraintsUtil";

const { DOCKER } = ContainerConstants.type;

const MarathonAppValidators = {
  /**
   * Ensure that the user has provided either a `cmd` or a docker image field.
   *
   * The following checks are ported from the following marathon file:
   *
   * https://github.com/mesosphere/marathon/blob
   *       /08bc0aed722ad9f3e989a597cb264a994387756f/src/main/scala/mesosphere
   *       /marathon/state/AppDefinition.scala
   *
   * @param {Object} app - The data to validate
   * @returns {Array} Returns an array with validation errors
   */
  containsCmdArgsOrContainer(app) {
    const hasCmd = !ValidatorUtil.isEmpty(app.cmd);
    const hasArgs = !ValidatorUtil.isEmpty(app.args);

    // Dont accept both `args` and `cmd`
    if (hasCmd && hasArgs) {
      const notBothMessage = "无法同时指定 `cmd` 或者 `args`，请选择其中的一个";
      const type = PROP_CONFLICT;
      const variables = {
        feature1: "cmd",
        feature2: "args"
      };

      return [
        { path: ["cmd"], message: notBothMessage, type, variables },
        { path: ["args"], message: notBothMessage, type, variables }
      ];
    }

    // Check if we have either of them
    if (hasCmd || hasArgs) {
      return [];
    }

    // Additional checks if we have container
    if (app.container) {
      // MesosDocker type of container (AppDefinition.scala#L553)
      if (app.container.docker && app.container.docker.image) {
        return [];
      }

      // MesosAppC type of container (Container.scala#L165)
      if (app.container.appc && app.container.appc.image) {
        // An image ID is a string of the format 'hash-value', where 'hash' is
        // the hash algorithm used and 'value' is the hex-encoded digest.
        // Currently the only permitted hash algorithm is sha512.
        // (Validation in Container.scala#L158)
        if (app.container.appc.id && !/^sha512-./.exec(app.container.appc.id)) {
          return [
            {
              path: ["container", "appc", "id"],
              message: "应用容器的 id 必须以 'sha512-' 开始",
              type: "STRING_PATTERN",
              variables: {
                pattern: "^sha512-"
              }
            }
          ];
        }

        return [];
      }
    }

    // Create one error for every field, instead of showing the error
    // to the root.
    const message = "你必须指定一个命令, 一个参数 或者 一个容器";
    const type = PROP_MISSING_ONE;
    const variables = {
      names: "cmd, args, container.docker.image"
    };

    return [
      { path: ["cmd"], message, type, variables },
      { path: ["args"], message, type, variables },
      { path: ["container", "docker", "image"], message, type, variables }
    ];
  },

  /**
   * @param {Object} app - The data to validate
   * @returns {Array} Returns an array with validation errors
   */
  complyWithResidencyRules(app) {
    const hasAppResidency = !ValidatorUtil.isEmpty(app.residency);
    let hasPersistentVolumes = false;

    // Check if app has at leas one persistent volume
    if (app.container && app.container.volumes) {
      hasPersistentVolumes = app.container.volumes.some(
        volume => !ValidatorUtil.isEmpty(volume.persistent)
      );
    }

    if (hasAppResidency !== hasPersistentVolumes) {
      const message =
        "应用定义必须包含 持久化的分区 和 " +
        "定义居留权";
      const type = PROP_MISSING_ALL;
      const variables = {
        names: "residency, container.volumes"
      };

      return [
        { path: ["residency"], message, type, variables },
        { path: ["container", "volumes"], message, type, variables }
      ];
    }

    return [];
  },

  /**
   * @param {Object} app - The data to validate
   * @returns {Array} Returns an array with validation errors
   */
  complyWithIpAddressRules(app) {
    // (AppDefinition.scala#L697)
    if (ValidatorUtil.isEmpty(app.ipAddress)) {
      return [];
    }

    // (AppDefinition.scala#L538)
    if (ValidatorUtil.isEmpty(app.discoveryInfo)) {
      return [];
    }

    // (AppDefinition.scala#L539)
    const network = findNestedPropertyInObject(app, "container.docker.network");
    if (ValidatorUtil.isEmpty(network)) {
      return [];
    }

    // (AppDefinition.scala#L539)
    if (/^(BRIDGE|USER)$/.exec(app.container.docker.network)) {
      const message =
        "ip地址/掩码 的方式 在 Docker 容器使用桥接或用户网络时 不允许使用";
      const type = PROP_CONFLICT;
      const variables = {
        feature1: "ipAddress or discoveryInfo",
        feature2: "container.docker.network"
      };

      return [
        { path: ["ipAddress"], message, type, variables },
        { path: ["discoveryInfo"], message, type, variables },
        { path: ["container", "docker", "network"], message, type, variables }
      ];
    }

    // No errors
    return [];
  },

  /**
   * @param {Object} app - The data to validate
   * @returns {Array} Returns an array with validation errors
   */
  mustContainImageOnDocker(app) {
    const type = findNestedPropertyInObject(app, "container.type");
    const image = findNestedPropertyInObject(app, "container.docker.image");

    if (type === DOCKER && ValidatorUtil.isEmpty(image)) {
      return [
        {
          path: ["container", "docker", "image"],
          message: '使用 Docker 引擎时必须指定运行时环境. 你可以在 "高级设置" 下更改运行时环境',
          type: "PROP_IS_MISSING",
          variables: {}
        }
      ];
    }

    return [];
  },

  /**
   * @param {Object} app - The data to validate
   * @returns {Array} Returns an array with validation errors
   */
  mustNotContainUris(app) {
    if (
      ValidatorUtil.isDefined(app.uris) &&
      ValidatorUtil.isDefined(app.fetch)
    ) {
      const message = "`uris` 已过时. 请使用 `fetch` 代替";
      const type = PROP_DEPRECATED;
      const variables = {
        name: "uris"
      };

      return [{ path: ["uris"], message, type, variables }];
    }

    // No errors
    return [];
  },

  validateConstraints(app) {
    const constraints = findNestedPropertyInObject(app, "constraints") || [];
    if (constraints != null && !Array.isArray(constraints)) {
      return [
        {
          path: ["constraints"],
          message: "约束 需要定义为一个长度为2或3的数组",
          type: "TYPE_NOT_ARRAY"
        }
      ];
    }

    const isRequiredMessage =
      "你必须为操作符 {{operator}} 指定一个值";
    const isRequiredEmptyMessage =
      "{{operator}} 的值必须为空";
    const isStringNumberMessage =
      "{{operator}} 只能包含字符 0-9";
    const variables = { name: "value" };

    return constraints.reduce((errors, constraint, index) => {
      if (!Array.isArray(constraint)) {
        errors.push({
          path: ["constraints", index],
          message: "必须是数组",
          type: "TYPE_NOT_ARRAY"
        });

        return errors;
      }

      const [_fieldName, operator, value] = constraint;
      const isValueRequiredAndEmpty =
        PlacementConstraintsUtil.requiresValue(operator) &&
        ValidatorUtil.isEmpty(value);

      if (isValueRequiredAndEmpty) {
        errors.push({
          path: ["constraints", index, "value"],
          message: isRequiredMessage.replace("{{operator}}", operator),
          type: PROP_MISSING_ONE,
          variables
        });
      }

      const isValueDefinedAndRequiredEmpty =
        PlacementConstraintsUtil.requiresEmptyValue(operator) &&
        !ValidatorUtil.isEmpty(value);

      if (isValueDefinedAndRequiredEmpty) {
        errors.push({
          path: ["constraints", index, "value"],
          message: isRequiredEmptyMessage.replace("{{operator}}", operator),
          type: SYNTAX_ERROR,
          variables
        });
      }

      const isValueNotAStringNumberWhenRequired =
        PlacementConstraintsUtil.stringNumberValue(operator) &&
        !ValidatorUtil.isEmpty(value) &&
        !ValidatorUtil.isStringInteger(value);

      if (isValueNotAStringNumberWhenRequired) {
        errors.push({
          path: ["constraints", index, "value"],
          message: isStringNumberMessage.replace("{{operator}}", operator),
          type: SYNTAX_ERROR,
          variables
        });
      }

      return errors;
    }, []);
  }
};

module.exports = MarathonAppValidators;
