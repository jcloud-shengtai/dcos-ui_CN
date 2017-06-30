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
        <path d="<path d="M83.9,140.4v-12c0-13-8-25-19-31c12-6,19-18,19-31v-13c5,0,10-5,10-10c0-6-5-10-10-10h-69c-6,0-10,5-10,10 s4,10,10,10v12c0,13,8,25,19,31c-12,6-19,18-19,31v12c-5,0-10,5-10,10c0,6,5,10,10,10h69c6,0,10-5,10-10 C92.9,144.4,88.9,140.4,83.9,140.4L83.9,140.4z M8.9,42.4c0-3,2-5,5-5h69c3,0,5,2,5,5c0,3-2,5-5,5h-69C10.9,47.4,8.9,45.4,8.9,42.4z M18.9,127.4c0-13,9-25,22-29c1,0,2-1,2-3c0-1-1-2-2-3c-13-4-22-15-22-29v-10h60v12c0,13-9,25-22,29c-1,0-2,1-2,3c0,1,1,2,2,3 c13,4,22,15,22,29v12h-5c-1-4-5-8-10-8h-12v-42c13-1,22-12,22-25v-3h-50v3c0,13,10,24,22,25v42h-12c-5,0-9,3-10,8h-5V127.4 L18.9,127.4z M82.9,155.4h-69c-3,0-5-2-5-5s2-5,5-5h69c3,0,5,2,5,5S85.9,155.4,82.9,155.4z"></path>" />
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
