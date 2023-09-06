// Then import schema types from any plugins that might expose them
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
export const schema = {
    types: [
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
    ]
}
