import React from 'react';
import { buildBackgroundStyleObject } from '../../utilities/imageUtil';

const buildClassArray = (classes, containerProps) => {
    const { display } = containerProps;
    classes = [...classes, 'container'];
    let classArray = classes.join(' ');
    return classArray;
};

const Container = ({ classes, children, ...props }) => {
    const { bgParamObj = undefined, tag } = props;
    const bgStyle = bgParamObj ? buildBackgroundStyleObject(bgParamObj) : {};
    const classArray = buildClassArray(classes, props);

    return (
        <>
            {tag === 'none' && <>{children}</>}
            {tag === 'div' && (
                <div className={classArray} style={bgStyle}>
                    {children}
                </div>
            )}
            {tag === 'section' && (
                <section className={classArray} style={bgStyle}>
                    {children}
                </section>
            )}
        </>
    );
};

export default Container;
