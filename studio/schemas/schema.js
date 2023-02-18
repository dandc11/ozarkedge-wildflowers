// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import siteSettings from './documents/siteSettings';
import menu from './documents/menu';
import mainImage from './objects/mainImage';
import menuItem from './objects/menuItem';
import figure from './objects/figure';
import pageBodyPortableText from './objects/pageBodyPortableText';
import plantName from './objects/plantName';
import aboutPage from './documents/aboutPage';
import nativePlant from './documents/nativePlant';
import landingPage from './documents/landingPage';
import plantListPage from './documents/plantListPage';
import pollinator from './documents/pollinator';
import link from './objects/link';
import button from './objects/button';
import season from './documents/season';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
    // We name our schema
    name: 'default',
    // Then proceed to concatenate our document type
    // to the ones provided by any plugins that are installed
    types: schemaTypes.concat([
        siteSettings,
        link,
        button,
        mainImage,
        figure,
        pageBodyPortableText,
        plantName,
        season,
        nativePlant,
        pollinator,
        plantListPage,
        aboutPage,
        landingPage,
        menu,
        menuItem,
    ]),
});
