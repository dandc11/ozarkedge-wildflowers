import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
import { useState } from 'react';

const Nav = (cx = props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
    };
    return (
        <nav className={`nav ${isMenuOpen ? `menu-active` : ''}`}>
            <button
                className={`menu-icon`}
                onClick={(e) => toggleMenu()}
                type="button"
            >
                <div className={`menu-icon-bar bar-one`}></div>
                <div className={`menu-icon-bar bar-two`}></div>
                <div className={`menu-icon-bar bar-three`}></div>
            </button>
            <ul className={`nav-links`}>
                <li className={`nav-list-item`}>
                    <Link href="/">
                        <a onClick={(e) => toggleMenu()}>Home</a>
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link href="/about">
                        <a onClick={(e) => toggleMenu()}>About Ozarkedge</a>
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link href="/">
                        <a onClick={(e) => toggleMenu()}>
                            Ozarkedge Native Plants
                        </a>
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link href="/">
                        <a onClick={(e) => toggleMenu()}>Seasons</a>
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link href="/">
                        <a onClick={(e) => toggleMenu()}>Fungi and Lichens</a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

Nav.propTypes = {};

export default Nav;
