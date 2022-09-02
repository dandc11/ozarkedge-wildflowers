import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Footer from './Footer';

const Layout = ({ children, ...props }) => {
    console.log(children);
    return (
        <div className="page-content">
            <Nav />
            {children}
            <Footer />
        </div>
    );
};

Layout.propTypes = {};

export default Layout;
