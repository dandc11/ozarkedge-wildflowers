import React from "react";
import PropTypes from "prop-types";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = (props, { children }) => {
  return (
    <div className="page-content">
      <Nav></Nav>
      {children}
      <Footer></Footer>
    </div>
  );
};

Layout.propTypes = {};

export default Layout;
