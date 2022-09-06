import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Footer from './Footer';
import landingPageStyles from './../styles/pages/landing-page.module.scss';

const Layout = ({ children, ...props }) => {
    console.log(children);
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
