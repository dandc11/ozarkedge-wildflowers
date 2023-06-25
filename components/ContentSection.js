import React from 'react'
import cx from 'classnames';
import Header from './Header';
import PortTextWrapper from './PortableText';

/**
 * ContentSection component - renders a content section containing a Header and (portable) text
 * @param {string} portableText - the content section portable text
 * @param {array} tocLinks - array of objects with link and text for table of contents
 * @param {string} sectionTitle - title of section (for section ID and ToC)
 * @param {string} openToCSection - section of table of contents that is open
 * @param {function} setShowToC - function to set section of table of contents that is open
 * @param {string} lightboxIdentifier - identifier for lightbox.js
 * @param {function} toggleLightboxCallback - function to toggle lightbox
 * @returns {JSX} - returns jsx of content section
 */
const ContentSection = ({
    className = '',
    portableText,
    tocLinks,
    sectionTitle = '',
    openToCSection,
    setShowToC = () => {},
    lightboxIdentifier,
    toggleLightboxCallback = () => {},
}) => {
    console.log(`ContentSection: ${sectionTitle}`, portableText);
    return (
        <>
            {portableText && (
                <section
                    className={cx('relative', {
                        'z-10': openToCSection === sectionTitle,
                        'z-0': openToCSection !== sectionTitle,
                    }, className)}
                >
                    <Header
                        id={sectionTitle}
                        wrapperClassName
                        showCircle
                        setShowToC={setShowToC}
                        showToC={openToCSection === sectionTitle}
                        tocLinks={tocLinks}
                    >
                        <span>{sectionTitle}</span>
                    </Header>
                    <div>
                        <PortTextWrapper
                            lightboxCallback={toggleLightboxCallback}
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