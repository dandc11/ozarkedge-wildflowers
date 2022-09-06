import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
import { useState } from 'react';
import navStyles from './../styles/components/nav.module.scss';

const Nav = (cx = props) => {
    console.log(navStyles);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {
        nav,
        navLinks,
        navListItem,
        menuOpen,
        menuIcon,
        menuIconBar,
        barOne,
        barTwo,
        barThree,
    } = navStyles;
    const toggleMenu = () => {
        isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
    };
    const menuClosed = isMenuOpen ? '' : menuOpen;
    return (
        <nav className={`${nav} ${isMenuOpen ? menuOpen : ''}`}>
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
                <li className={`${navListItem}`}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li className={`${navListItem}`}>
                    <Link href="/about">
                        <a>About Ozarkedge</a>
                    </Link>
                </li>
                <li className={`${navListItem}`}>
                    <Link href="/">
                        <a>Ozarkedge Native Plants</a>
                    </Link>
                </li>
                <li className={`${navListItem}`}>
                    <Link href="/">
                        <a>Seasons</a>
                    </Link>
                </li>
                <li className={`${navListItem}`}>
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
