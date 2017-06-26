import React, { PropTypes } from "react";

function EmptyLogScreen({ logName }) {
  // Append space if logName is defined
  logName = logName && logName + " ";

  return (
    <div className="flex-grow horizontal-center vertical-center">
      <h3 className="text-align-center flush-top">
        {`${logName} 当前日志为空`}
      </h3>
      <p className="text-align-center flush-bottom">
        Please try again later.
      </p>
    </div>
  );
}

EmptyLogScreen.propTypes = {
  logName: PropTypes.string
};

module.exports = EmptyLogScreen;
