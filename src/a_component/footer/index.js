/* Footer 页面底部 */
import React from "react";
import P from "prop-types";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="footer flex-none">
        © 2017{" "}
        <a href="http://isluo.com" target="_blank" rel="noopener noreferrer">
          isluo.com
        </a>, Inc.
      </div>
    );
  }
}

Footer.propTypes = {};

export default Footer;
