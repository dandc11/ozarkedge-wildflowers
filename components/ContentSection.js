import React from 'react';
import cx from 'classnames';
import Header from './Header';
import PortTextWrapper from './PortableText';

/**
 * ContentSection component - renders a content section containing a Header and (portable) text. Accepts table of contents props for Header.
 * Created 07/01/23 
 * @param {string} portableText - the content section portable text
 * @param {array} tocLinks - array of objects with link and text for table of contents
 * @param {string} sectionId - id of section (for section ID and ToC)
 * @param {string} headerTitle - title of section (for display)
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @param {function} toggleLightboxCallback - function to toggle lightbox
 * @returns {JSX} - returns jsx of content section
 */
const ContentSection = ({
    className = '',
    portableText,
    tocLinks,
    sectionId = '',
    headerTitle = '',
    lightboxIdentifier = '',
    toggleLightboxCallback = () => {},
}) => {

    return (
        <>
            {portableText && (
                <section
                    className={cx('relative', className)}
                >
                    <Header
                        id={sectionId}
                        title={headerTitle}
                        className={``}
                        showCircle
                        tocLinks={tocLinks}
                    >
                        {headerTitle}
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
                            lightboxIdentifier={lightboxIdentifier}
                            className={className}
                            value={portableText}
                        ></PortTextWrapper>
                        <br></br>
                    </div>
                </section>
            )}
        </>
    );
};


export default ContentSection;