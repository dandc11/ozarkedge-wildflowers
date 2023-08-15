export const DOCUMENT_TYPES = [
    { type: 'nativePlant' },
    { type: 'landingPage' },
    { type: 'aboutPage' },
    { type: 'plantListPage' },
    { type: 'season' },
    { type: 'pollinator' },
];

export const DOCTYPE_PATH_PREFIXES = {
    NATIVE_PLANT: {TYPE: 'nativePlant', PARENT_PATH: '/native-plants/'},
    SEASON:  {TYPE: 'season', PARENT_PATH: '/season/'},
    POLLINATOR: {TYPE: 'pollinator', PARENT_PATH: '/pollinators/'},
    ABOUT_PAGE: {TYPE: 'about', PARENT_PATH: '/'},
    LANDING_PAGE: {TYPE: 'landingPage', PARENT_PATH: '/'},
    PLANT_LIST_PAGE: {TYPE: 'plantListPage', PARENT_PATH: '/'},
};
