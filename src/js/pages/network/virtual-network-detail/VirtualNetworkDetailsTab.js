import React from "react";

import ConfigurationMap from "../../../components/ConfigurationMap";
import ConfigurationMapLabel from "../../../components/ConfigurationMapLabel";
import ConfigurationMapRow from "../../../components/ConfigurationMapRow";
import ConfigurationMapSection
  from "../../../components/ConfigurationMapSection";
import ConfigurationMapValue from "../../../components/ConfigurationMapValue";
import Overlay from "../../../structs/Overlay";

class VirtualNetworkDetailsTab extends React.Component {
  render() {
    const { overlay } = this.props;

    return (
      <div className="container">
        <ConfigurationMap>
          <ConfigurationMapSection>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                名称
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {overlay.getName()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                IP子网
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {overlay.getSubnet()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
          </ConfigurationMapSection>
        </ConfigurationMap>
      </div>
    );
  }
}

VirtualNetworkDetailsTab.propTypes = {
  overlay: React.PropTypes.instanceOf(Overlay)
};

module.exports = VirtualNetworkDetailsTab;
