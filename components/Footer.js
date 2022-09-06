import React from 'react';
import PropTypes from 'prop-types';
import footerStyles from './../styles/components/footer.module.scss';

const Footer = (props) => {
    const { footer } = footerStyles;
    return <div className={`${footer}`}>Footer</div>;
};

Footer.propTypes = {};

export default Footer;
