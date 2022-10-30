import React from 'react';
import PropTypes from 'prop-types';

const BloomingNow = (props) => {
    const {} = props;
    return (
        <div>
            <section className={`plant-list`}>Blooming Now</section>
            <section className={`featured-plant`}>Featured Plant</section>
        </div>
    );
};

BloomingNow.propTypes = {};

export default BloomingNow;
