import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
import { useState } from 'react';

const Nav = (cx = props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`nav ${isMenuOpen ? `menu-active` : ''}`}>
            <button
                className={`menu-icon`}
                onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                type="button"
            >
                <div className={`menu-icon-bar bar-one`}></div>
                <div className={`menu-icon-bar bar-two`}></div>
                <div className={`menu-icon-bar bar-three`}></div>
            </button>
            <ul className={`nav-links`}>
                <li className={`nav-list-item`}>
                    <Link href="/" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Home
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/about"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        About Ozarkedge
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/native-plants"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Ozarkedge Native Plants
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/seasons"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Seasons
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link href="/" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Fungi and Lichens
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

Nav.propTypes = {};

export default Nav;
