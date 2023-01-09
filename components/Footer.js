import React from 'react';
import PropTypes from 'prop-types';

const Footer = (props) => {
    return <div className={`footer w-full h-28 flex justify-center align-middle text-white bg-green-700 `}>
        <p className={`copyright text-sm text-inherit`}>© Copyright 2022. Ozarkedge Wildflowers</p>
    </div>;
};

Footer.propTypes = {};

export default Footer;
