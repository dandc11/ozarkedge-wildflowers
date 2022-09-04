import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Footer from './Footer';
import globalStyles from './../styles/global.module.scss';

const Layout = ({ children, ...props }) => {
    console.log(children);
    const { pageContent } = globalStyles;
    return (
        <div className={`${pageContent}`}>
            <Nav />
            {children}
            <Footer />
        </div>
    );
};

Layout.propTypes = {};

export default Layout;
