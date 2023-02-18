import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Footer from './Footer';

const Layout = ({ children, ...props }) => {
    return (
        <div className={`flex flex-col`}>
            <Nav />
            <div id={`page-content`} className={`relative min-h-screen text-lg`}>{children}</div>
            <Footer />
        </div>
    );
};

Layout.propTypes = {};

export default Layout;
