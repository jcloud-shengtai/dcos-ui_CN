const Labels = {
  type: "object",
  title: "标签",
  description: "给任务设置标签，将信息暴露给其它任务.",
  properties: {
    items: {
      type: "array",
      duplicable: true,
      addLabel: "添加标签",
      getter(job) {
        const labels = job.getLabels() || {};

        return Object.keys(labels).map(function(key) {
          return {
            key,
            value: labels[key]
          };
        });
      },
      itemShape: {
        properties: {
          key: {
            title: "标签名",
            type: "string"
          },
          value: {
            title: "值",
            type: "string"
          }
        }
      }
    }
  }
};

module.exports = Labels;
