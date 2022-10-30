import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Footer from './Footer';

const Layout = ({ children, ...props }) => {
    return (
        <>
            <Nav />
            <div className="page-content">{children}</div>
            <Footer />
        </>
    );
};

Layout.propTypes = {};

export default Layout;
