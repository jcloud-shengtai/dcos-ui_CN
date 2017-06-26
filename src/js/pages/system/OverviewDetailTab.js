import mixin from "reactjs-mixin";
import { Link } from "react-router";
import { MountService } from "foundation-ui";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */
import { StoreMixin } from "mesosphere-shared-reactjs";

import Breadcrumb from "../../components/Breadcrumb";
import BreadcrumbTextContent from "../../components/BreadcrumbTextContent";
import Config from "../../config/Config";
import ConfigStore from "../../stores/ConfigStore";
import ConfigurationMap from "../../components/ConfigurationMap";
import ConfigurationMapHeading from "../../components/ConfigurationMapHeading";
import ConfigurationMapLabel from "../../components/ConfigurationMapLabel";
import ConfigurationMapRow from "../../components/ConfigurationMapRow";
import ConfigurationMapSection from "../../components/ConfigurationMapSection";
import ConfigurationMapValue from "../../components/ConfigurationMapValue";
import { findNestedPropertyInObject } from "../../utils/Util";
import HashMapDisplay from "../../components/HashMapDisplay";
import Loader from "../../components/Loader";
import MarathonStore
  from "../../../../plugins/services/src/js/stores/MarathonStore";
import MetadataStore from "../../stores/MetadataStore";
import Page from "../../components/Page";
import VersionsModal from "../../components/modals/VersionsModal";

const METHODS_TO_BIND = [
  "handleClusterConfigModalClose",
  "handleClusterConfigModalOpen"
];

const SystemOverviewBreadcrumbs = () => {
  const crumbs = [
    <Breadcrumb key={0} title="Cluster">
      <BreadcrumbTextContent>
        <Link to="/system-overview">系统总览</Link>
      </BreadcrumbTextContent>
    </Breadcrumb>
  ];

  return <Page.Header.Breadcrumbs iconID="cluster" breadcrumbs={crumbs} />;
};

class OverviewDetailTab extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      isClusterBuildInfoOpen: false
    };

    this.store_listeners = [
      {
        name: "config",
        events: ["ccidSuccess"]
      },
      {
        name: "marathon",
        events: ["instanceInfoSuccess"]
      },
      {
        name: "metadata",
        events: ["dcosBuildInfoChange", "dcosSuccess", "success"]
      }
    ];

    METHODS_TO_BIND.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount(...arguments);

    ConfigStore.fetchCCID();
    MarathonStore.fetchMarathonInstanceInfo();
    MetadataStore.fetchDCOSBuildInfo();
  }

  handleClusterConfigModalOpen() {
    this.setState({ isClusterBuildInfoOpen: true });
  }

  handleClusterConfigModalClose() {
    this.setState({ isClusterBuildInfoOpen: false });
  }

  getLoading() {
    return <Loader size="small" type="ballBeat" />;
  }

  getClusterDetails() {
    let ccid = ConfigStore.get("ccid");
    let publicIP = this.getPublicIP();
    let productVersion = MetadataStore.version;

    if (Object.keys(ccid).length) {
      ccid = ccid.zbase32_public_key;
    } else {
      ccid = this.getLoading();
    }

    if (productVersion == null) {
      productVersion = this.getLoading();
    }

    if (publicIP == null) {
      publicIP = this.getLoading();
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapRow key="version">
          <ConfigurationMapLabel>
            {Config.productName} 版本
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {productVersion}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow key="ccid">
          <ConfigurationMapLabel>
            加密集群ID
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {ccid}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow key="publicIP">
          <ConfigurationMapLabel>
            公共IP
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {publicIP}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getMarathonDetailsHash() {
    const marathonDetails = MarathonStore.getInstanceInfo();

    if (!Object.keys(marathonDetails).length) {
      return null;
    }

    return {
      "Marathon 详情": {
        "版本": marathonDetails.version,
        "框架ID": marathonDetails.frameworkId,
        Leader: marathonDetails.leader,
        "Marathon 配置": marathonDetails.marathon_config,
        "ZooKeeper 配置": marathonDetails.zookeeper_config
      }
    };
  }

  getPageHeaderActions() {
    return [
      {
        label: "查看集群配置",
        onItemSelect: this.handleClusterConfigModalOpen
      }
    ];
  }

  getPublicIP() {
    const publicIP = findNestedPropertyInObject(
      MetadataStore.get("metadata"),
      "PUBLIC_IPV4"
    );

    if (!publicIP) {
      return null;
    }

    return publicIP;
  }

  render() {
    const buildInfo = MetadataStore.get("dcosBuildInfo");
    const marathonHash = this.getMarathonDetailsHash();
    let marathonDetails = null;
    let versionsModal = null;

    if (marathonHash) {
      marathonDetails = <HashMapDisplay hash={marathonHash} />;
    }

    if (buildInfo != null) {
      versionsModal = (
        <VersionsModal
          onClose={this.handleClusterConfigModalClose}
          open={this.state.isClusterBuildInfoOpen}
          versionDump={buildInfo}
        />
      );
    }

    return (
      <Page>
        <Page.Header
          actions={this.getPageHeaderActions()}
          breadcrumbs={<SystemOverviewBreadcrumbs />}
        />
        <div className="container">
          <ConfigurationMap>
            <ConfigurationMapHeading className="flush-top">
              集群详细地址
            </ConfigurationMapHeading>
            <ConfigurationMapHeading level={2}>
              通用
            </ConfigurationMapHeading>
            {this.getClusterDetails()}
            {marathonDetails}
            <MountService.Mount type="OverviewDetailTab:AdditionalClusterDetails" />
          </ConfigurationMap>
        </div>
        {versionsModal}
      </Page>
    );
  }
}

OverviewDetailTab.routeConfig = {
  label: "Overview",
  matches: /^\/system-overview\/details/
};

module.exports = OverviewDetailTab;
