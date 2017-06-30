import React from "react";

class IconDCOSLogoMark extends React.Component {
  render() {
    return (
      <svg
        className={this.props.className}
        width="200"
        height="200"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        {...this.props}
      >
        <path d="M-130.6,67.7v-1.2c0-1.3-0.8-2.5-1.9-3.1c1.2-0.6,1.9-1.8,1.9-3.1V59c0.5,0,1-0.5,1-1c0-0.6-0.5-1-1-1h-6.9
	c-0.6,0-1,0.5-1,1c0,0.5,0.4,1,1,1v1.2c0,1.3,0.8,2.5,1.9,3.1c-1.2,0.6-1.9,1.8-1.9,3.1v1.2c-0.5,0-1,0.5-1,1c0,0.6,0.5,1,1,1h6.9
	c0.6,0,1-0.5,1-1C-129.7,68.1-130.1,67.7-130.6,67.7L-130.6,67.7z M-138.1,57.9c0-0.3,0.2-0.5,0.5-0.5h6.9c0.3,0,0.5,0.2,0.5,0.5
	c0,0.3-0.2,0.5-0.5,0.5h-6.9C-137.9,58.4-138.1,58.2-138.1,57.9z M-137.1,66.4c0-1.3,0.9-2.5,2.2-2.9c0.1,0,0.2-0.1,0.2-0.3
	c0-0.1-0.1-0.2-0.2-0.3c-1.3-0.4-2.2-1.5-2.2-2.9V59h6v1.2c0,1.3-0.9,2.5-2.2,2.9c-0.1,0-0.2,0.1-0.2,0.3c0,0.1,0.1,0.2,0.2,0.3
	c1.3,0.4,2.2,1.5,2.2,2.9v1.2h-0.5c-0.1-0.4-0.5-0.8-1-0.8h-1.2v-4.2c1.3-0.1,2.2-1.2,2.2-2.5v-0.3h-5v0.3c0,1.3,1,2.4,2.2,2.5v4.2
	h-1.2c-0.5,0-0.9,0.3-1,0.8h-0.5L-137.1,66.4L-137.1,66.4z M-130.7,69.2h-6.9c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5h6.9
	c0.3,0,0.5,0.2,0.5,0.5C-130.2,69-130.4,69.2-130.7,69.2z" />
      </svg>
    );
  }
}

IconDCOSLogoMark.defaultProps = {
  className: "icon icon-logo-mark"
};

IconDCOSLogoMark.propTypes = {
  className: React.PropTypes.string
};

module.exports = IconDCOSLogoMark;
