import { PortableText } from '@portabletext/react';
import Link from './Link';
import { DOCTYPE_PATH_PREFIXES } from '@lib/utilities/constants';

const portTextComponents = {
    types: {
        image: ({ value }) => <img src={value.imageUrl} />,
        callToAction: ({ value, isInline }) =>
            isInline ? (
                <a href={value.url}>{value.text}</a>
            ) : (
                <div className="callToAction">{value.text}</div>
            ),
    },

    marks: {
        // link: ({ children, value }) => <Link docType={DOCTYPE_PATH_PREFIXES.nativePlant} href={value}>{children}</Link>,
        link: ({ children, value }) => console.log('value ', value),
    },
};

const PortTextWrapper = (props) => {
    return <PortableText value={props.value} components={portTextComponents} />;
};

export default PortTextWrapper;
