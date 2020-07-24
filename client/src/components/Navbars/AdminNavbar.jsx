
import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import logo from "../../assets/img/logo.png"

import AdminNavbarLinks from "./AdminNavbarLinks.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  render() {
    return (
      <Navbar fluid style={{ height: `100px`, padding: `0 5%` }}>
        <Navbar.Header>
          <Navbar.Brand>
            {/*<a href="#ocean">{this.props.brandText}</a>*/}
            <img src={logo} classname="navbar-logo" style={{ display: `inline`, height: `70px`, width: `70px` }} />
            <span classname="navbar-title" style={{ fontSize: `30px`, textAlign: `center`, marginLeft: '50px' }}>Ocean Pacific Dashboard</span>
          </Navbar.Brand>
          {/*<Navbar.Toggle onClick={this.mobileSidebarToggle} />*/}

        </Navbar.Header>
        <Navbar.Collapse>

        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
