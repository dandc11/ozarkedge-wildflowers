import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';

const Nav = (cx = props) => {
    return (
        <nav>
            <div className="menu-icon">
                <div className="menu-icon-bar one"></div>
                <div className="menu-icon-bar two"></div>
                <div className="menu-icon-bar three"></div>
            </div>
            <div className="nav-links">
                <Link href="/">
                    <a>Home</a>
                </Link>
                <Link href="/about">
                    <a>About Ozarkedge</a>
                </Link>
                <Link href="/">
                    <a>Plant List</a>
                </Link>
                <Link href="/">
                    <a>Seasons</a>
                </Link>
                <Link href="/">
                    <a>Fungi and Lichens</a>
                </Link>
            </div>
        </nav>
    );
};

Nav.propTypes = {};

export default Nav;
