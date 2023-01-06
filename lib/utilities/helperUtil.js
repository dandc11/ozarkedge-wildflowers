import { MONTH_NAMES } from './constants';
import { SEASONS } from './constants';
import { DOCTYPE_PATH_PREFIXES } from './constants';

export const getCurrentMonthName = () => {
    const CURRENT_MONTH_NAME = new Date(Date.now()).getMonth() + 1;
    return MONTH_NAMES[CURRENT_MONTH_NAME - 1];
};

export const getCurrentMonthNumber = () => {
    const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1;
    return CURRENT_MONTH_NUMBER;
};

export const getInternalLinkFullPath = (docytype, slug) => {
    // console.log('doctype ', docytype);
    // console.log('slug ', slug);
    const fullPath = DOCTYPE_PATH_PREFIXES[docytype]
        ? DOCTYPE_PATH_PREFIXES[docytype] + slug
        : slug;
    return fullPath;
};

export const getSeasonNameForMonthNumber = (monthNum) => {
    let testSeason;
    for (const season in SEASONS) {
        testSeason = SEASONS[season]
        if (testSeason.SEASON_MONTHS.includes(monthNum)) {
            return testSeason.SEASON_NAME;
        }
    }
};
