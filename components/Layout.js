import React from 'react';

import Nav from './Nav';
import Footer from './Footer';

const Layout = ({ children, ...props }) => {
    return (
        <div className={`flex flex-col`}>
            <Nav />
            <div id={`page-content`} className={`relative min-h-screen text-base leading-normal bp-1100:text-lg`}>{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;
