import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useState } from 'react';
import cx from 'classnames';

const Nav = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`group/nav fixed font-display tracking-tight pt-6 bg-gradient-to-br from-oe-green-600 to-oe-green-yelow-800 text-2xl flex z-20 ${cx({'menu-active px-5 pt-6 w-full h-full overflow-hidden bg-white' : isMenuOpen})}`}>
            <button
                className={`menu-icon absolute top-5 left-5 z-10 h-6 border-none flex flex-col justify-between`}
                onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                type="button"
            >
                <div className={`w-8 h-1 bg-gradient-to-r from-oe-red-600 to-oe-red-700 ${cx({'bg-slate-100 bg-none' : isMenuOpen})}`}></div>
                <div className={`w-8 h-1 bg-gradient-to-r from-oe-red-600 to-oe-red-700 ${cx({'bg-slate-100 bg-none' : isMenuOpen})}`}></div>
                <div className={`w-8 h-1 bg-gradient-to-r from-oe-red-600 to-oe-red-700 ${cx({'bg-slate-100 bg-none' : isMenuOpen})}`}></div>
            </button>
            <ul className={`nav-links mt-16 hidden group-[.menu-active]/nav:block`}>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Home
                    </Link>
                </li> 
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link
                        href="/about"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        About Ozarkedge
                    </Link>
                </li>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={menuImage.asset}
                    alt={menuImage.alt}
                /> */}
                    <Link
                        href="/native-plants"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Ozarkedge Native Plants
                    </Link>
                </li>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/pollinators" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
                        Pollinators
                    </Link>
                </li>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link
                        href="/season/spring"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Spring
                    </Link>
                </li>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link
                        href="/season/summer"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Summer
                    </Link>
                </li>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link
                        href="/season/fall"
                        onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                        Fall
                    </Link>
                </li>
                <li className={`nav-list-item text-slate-100 pb-2 flex`}>
                                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
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
