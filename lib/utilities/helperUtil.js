import React from 'react';
import { MONTH_NAMES } from './constants';
import { SEASONS } from './constants';
import { DOCTYPE_PATH_PREFIXES } from './constants';

export const getInternalLinkFullPath = (docytype = '', slug = '') => {
    const fullPath = DOCTYPE_PATH_PREFIXES[docytype]
        ? DOCTYPE_PATH_PREFIXES[docytype] + slug
        : slug;
    return fullPath;
};

export const getCurrentMonthName = () => {
    const CURRENT_MONTH_NAME = new Date(Date.now()).getMonth() + 1;
    return MONTH_NAMES[CURRENT_MONTH_NAME - 1];
};

export const getCurrentMonthNumber = () => {
    const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1;
    return CURRENT_MONTH_NUMBER;
};

export const getSeasonFromMonthNumber = (monthNum) => {
    let season;
    for (const testSeason in SEASONS) {
        season = SEASONS[testSeason];
        if (season.SEASON_MONTHS.includes(monthNum)) {
            return season;
        }
    }
};

export const truncateText = (text = '', charLimit = 1000000) => {
    let ellipsis = <span className='tracking-tighter'>...</span>;
    let truncatedText = '';
    if (text.length > charLimit) {
        truncatedText = <>
        text.substring(0, charLimit) + ellipsis</>
     }
     return truncatedText;
}

export const titleCase = (textString = '') => textString.charAt(0).toUpperCase() + textString.slice(1);


export const getCurrentSeason = () =>
    getSeasonFromMonthNumber(getCurrentMonthNumber());
