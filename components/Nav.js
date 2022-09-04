import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
import { useState } from 'react';
import navStyles from './../styles/nav.module.scss';
import globalStyles from './../styles/global.module.scss';

const Nav = (cx = props) => {
    console.log(navStyles);
    const [menuOpen, setMenuOpen] = useState(false);
    const {
        nav,
        navLinks,
        navClosed,
        menuIcon,
        menuIconBar,
        barOne,
        barTwo,
        barThree,
    } = navStyles;
    const toggleMenu = () => {
        menuOpen ? setMenuOpen(false) : setMenuOpen(true);
    };
    const menuClosed = menuOpen ? '' : navClosed;
    return (
        <nav className={`${nav} ${menuClosed}`}>
            <button
                className={`${menuIcon}`}
                onClick={(e) => toggleMenu()}
                type="button"
            >
                <div className={`${menuIconBar} ${barOne}`}></div>
                <div className={`${menuIconBar} ${barTwo}`}></div>
                <div className={`${menuIconBar} ${barThree}`}></div>
            </button>
            <ul className={`${navLinks}`}>
                <li>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        <a>About Ozarkedge</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <a>Plant List</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <a>Seasons</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <a>Fungi and Lichens</a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

Nav.propTypes = {};

export default Nav;
