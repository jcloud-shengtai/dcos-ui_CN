import classNames from "classnames";
import React from "react";
import { Tooltip } from "reactjs-components";

import Config from "../../../../../src/js/config/Config";
import Icon from "../../../../../src/js/components/Icon";
import Units from "../../../../../src/js/utils/Units";

const displayedResourceValues = {
  roles: "Role",
  constraints: "Constraints",
  cpus: "CPU",
  mem: "Memory",
  disk: "Disk",
  ports: "Ports"
};

const MAX_BAR_HEIGHT = 200;

function getGraphBar(resource, data, index) {
  const resourceOfferSummary = data[resource];
  const matchedOffers = resourceOfferSummary.matched;
  const offeredCount = resourceOfferSummary.offers;
  let percentageMatched = null;
  let percentageOffered = null;

  // Avoid NaN and infinite values from division by zero.
  if (offeredCount === 0) {
    percentageMatched = 0;
  } else {
    percentageMatched = matchedOffers / offeredCount;
  }

  if (data.roles.offers === 0 || offeredCount === 0) {
    percentageOffered = 0;
  } else {
    percentageOffered = offeredCount / data.roles.offers;
  }

  const barGraphMatchedClasses = classNames("funnel-graph-item-bar-matched", {
    "funnel-graph-item-bar-matched-border-top": percentageMatched > 0 &&
      percentageMatched < 1
  });

  const offeredHeight = Math.ceil(MAX_BAR_HEIGHT * percentageOffered);
  const matchedHeight = Math.ceil(offeredHeight * percentageMatched);

  return (
    <Tooltip
      content={getResourceTooltipContent(resource, data)}
      interactive={true}
      key={index}
      width={200}
      wrapText={true}
      wrapperClassName="funnel-graph-item"
    >
      <div className="funnel-graph-item-bar">
        <div className="funnel-graph-item-percentage">
          {Math.ceil(percentageMatched * 100)}%
        </div>
        <div
          className="funnel-graph-item-bar-offered"
          style={{ flexBasis: `${offeredHeight}px` }}
        >
          <div
            className={barGraphMatchedClasses}
            style={{ flexBasis: `${matchedHeight}px` }}
          />
        </div>
      </div>
      <div className="funnel-graph-item-label">
        <div className="funnel-graph-item-label-primary">
          {displayedResourceValues[resource]}
        </div>
        <div className="funnel-graph-item-label-secondary small flush-bottom">
          {Units.contractNumber(resourceOfferSummary.matched)}/
          {Units.contractNumber(resourceOfferSummary.offers)}
        </div>
      </div>
    </Tooltip>
  );
}

function getGraphSpacer({ key, showIcon = true }) {
  let icon = null;

  if (showIcon) {
    icon = <Icon id="caret-right" size="small" color="light-grey" />;
  }

  return (
    <div className="funnel-graph-item-spacer" key={key}>
      {icon}
      <div className="funnel-graph-item-label" />
    </div>
  );
}

function getResourceTooltipContent(resource, data) {
  let { matched, offers, requested: requestedValue } = data[resource];
  let docsURI = null;
  let explanatoryText = null;

  if (matched === 0) {
    explanatoryText = "未匹配到";
  } else if (matched >= offers) {
    explanatoryText = "匹配到了";
  } else {
    explanatoryText = "部分匹配了";
  }

  if (resource === "roles") {
    docsURI = `${Config.mesosDocsURI}roles/`;
    explanatoryText = `资源提供者 ${explanatoryText} 你的服务角色 (${requestedValue}).`;
  }

  if (resource === "constraints") {
    docsURI = `${Config.marathonDocsURI}constraints.html`;
    explanatoryText = `资源提供者 ${explanatoryText} 你的服务所需 (${requestedValue}).`;
  }

  if (resource === "cpus") {
    docsURI = `${Config.mesosDocsURI}attributes-resources/`;
    explanatoryText = `CPU 已分配 ${explanatoryText} 你的服务所需 (${requestedValue}).`;
  }

  if (resource === "mem") {
    requestedValue = Units.formatResource(resource, requestedValue);
    docsURI = `${Config.mesosDocsURI}attributes-resources/`;
    explanatoryText = `内存已分配 ${explanatoryText} 你的服务所需 (${requestedValue}).`;
  }

  if (resource === "disk") {
    requestedValue = Units.formatResource(resource, requestedValue);
    explanatoryText = `磁盘空间已分配 ${explanatoryText} 你的服务所需 (${requestedValue}).`;
    docsURI = `${Config.mesosDocsURI}attributes-resources/`;
  }

  if (resource === "ports") {
    explanatoryText = `端口已分配 ${explanatoryText} 你的服务所需 (${requestedValue}).`;
    docsURI = `${Config.mesosDocsURI}attributes-resources/`;
  }

  return (
    <span>
      {explanatoryText} <a href={docsURI} target="_blank">Learn more</a>.
    </span>
  );
}

function RecentOffersSummary({ data }) {
  const funnelItems = ["roles", "constraints", "cpus", "mem", "disk", "ports"];
  const funnelGraphItems = funnelItems.reduce((accumulator, item, index) => {
    accumulator.push(getGraphBar(item, data, index));

    if (index < funnelItems.length - 1) {
      accumulator.push(getGraphSpacer({ key: `spacer-${index}` }));
    }

    return accumulator;
  }, []);

  funnelGraphItems.unshift(
    getGraphSpacer({ key: "graph-start", showIcon: false })
  );

  funnelGraphItems.push(getGraphSpacer({ key: "graph-end", showIcon: false }));

  return (
    <div className="funnel-graph pod flush-horizontal">
      <div className="funnel-graph-bars">
        {funnelGraphItems}
      </div>
      <div className="funnel-graph-key">
        <div className="funnel-graph-key-item">
          <span className="funnel-graph-key-dot funnel-graph-key-dot-matched dot" />
          Matched
        </div>
        <div className="funnel-graph-key-item">
          <span className="funnel-graph-key-dot funnel-graph-key-dot-declined dot" />
          Declined
        </div>
      </div>
    </div>
  );
}

module.exports = RecentOffersSummary;
