import { Link } from "gatsby";
import React from "react";
import Icon from "./icons";
import { cn } from "../lib/helpers";

import * as styles from "./header.module.css";

const Header = ({ onHideNav, onShowNav, showNav, siteTitle }) => (
  <div className={}>
    <div className={}>
      <div className={}>
        <Link to="/">{siteTitle}</Link>
      </div>

      <button
        className={}
        onClick={showNav ? onHideNav : onShowNav}
      >
        <Icon symbol="hamburger" />
      </button>

      <nav className={}>
        <ul>
          <li>
            {/* <Link to="/archive/">Archive</Link> */}
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Header;