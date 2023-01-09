import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useState } from 'react';
import cx from 'classnames';

const Nav = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`group/nav fixed font-display tracking-tight text-black z-20 ${cx({'menu-active w-full h-full overflow-hidden bg-white' : isMenuOpen})}`}>
            <button
                className={`menu-icon absolute top-5 left-5 z-10 h-6 border-none flex flex-col justify-between`}
                onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                type="button"
            >
                <div className={`w-8 h-1 bg-black`}></div>
                <div className={`w-8 h-1 bg-black`}></div>
                <div className={`w-8 h-1 bg-black`}></div>
            </button>
            <ul className={`nav-links mt-16 hidden group-[.menu-active]/nav:text-blue-600 group-[.menu-active]/nav:block`}>
                <li className={`nav-list-item pb-0.5`}>
                    <Link href="/" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Home
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
                    <Link
                        href="/about"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        About Ozarkedge
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
                    <Link
                        href="/native-plants"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Ozarkedge Native Plants
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
                    <Link href="/" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Fungi and Lichens
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
                    <Link
                        href="/season/spring"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Spring
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
                    <Link
                        href="/season/summer"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Summer
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
                    <Link
                        href="/season/fall"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Fall
                    </Link>
                </li>
                <li className={`nav-list-item pb-0.5`}>
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
