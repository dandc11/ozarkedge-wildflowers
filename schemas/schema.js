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
