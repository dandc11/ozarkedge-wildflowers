import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
// import Link from './Link'
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
                    <Link href="/" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Fungi and Lichens
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/season/spring"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Spring
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/season/summer"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Summer
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/season/fall"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Fall
                    </Link>
                </li>
                <li className={`nav-list-item`}>
                    <Link
                        href="/season/winter"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Winter
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

Nav.propTypes = {};

export default Nav;
