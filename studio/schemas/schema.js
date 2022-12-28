// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import siteSettings from './documents/siteSettings';
import category from './objects/category';
import mainImage from './objects/mainImage';
import figure from './objects/figure';
import pageBodyPortableText from './objects/pageBodyPortableText';
import plantPortableText from './objects/plantPortableText';
import plantName from './objects/plantName';
import aboutPage from './documents/aboutPage';
import nativePlant from './documents/nativePlant';
import landingPage from './documents/landingPage';
import plantListPage from './documents/plantListPage';
import pollinator from './documents/pollinator';
import nearbyPlant from './objects/nearbyPlant';
import link from './objects/link';
import button from './objects/button';
import season from './objects/season';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
    // We name our schema
    name: 'default',
    // Then proceed to concatenate our document type
    // to the ones provided by any plugins that are installed
    types: schemaTypes.concat([
        siteSettings,
        category,
        link,
        button,
        mainImage,
        figure,
        pageBodyPortableText,
        plantPortableText,
        plantName,
        season,
        nearbyPlant,
        nativePlant,
        pollinator,
        plantListPage,
        aboutPage,
        landingPage,
    ]),
});
