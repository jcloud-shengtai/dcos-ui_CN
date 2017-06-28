import React from "react";

import MetadataStore from "../../../../../src/js/stores/MetadataStore";

const summaryDocsURL = MetadataStore.buildDocsURI(
  "/overview/concepts/#mesos-resource-offer"
);

module.exports = {
  summaryIntro: (
    <span>
      {
        "当你尝试部署服务时, JSSP 等待 offers 来匹配你的服务所必须的资源. 如果 offer 没有满足要求, 它会降低优先级 并且 DC/OS 会重试. "
      }
      <a href={summaryDocsURL} target="_blank">查看更多</a>.
    </span>
  )
};
