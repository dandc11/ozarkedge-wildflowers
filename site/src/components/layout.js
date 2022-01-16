
import React from "react";
import Header from "./header";

// import "../styles/layout.css";
// import * as styles from "./layout.module.css";

const Layout = ({ children, onHideNav, onShowNav, showNav, siteTitle }) => (
  <>
    <Header
      siteTitle={siteTitle}
      onHideNav={onHideNav}
      onShowNav={onShowNav}
      showNav={showNav}
    />
    <div className={}>{children}</div>
    <footer className={}>
      <div className={}>
          Ozarkedge footer
      </div>
    </footer>
  </>
);

export default Layout;