import React from 'react';
import { MONTH_NAMES } from './constants';
import { SEASONS } from './constants';
import { DOCTYPE_PATH_PREFIXES } from './constants';

export const getInternalLinkFullPath = (docytype = '', slug = '') => {
    return DOCTYPE_PATH_PREFIXES[docytype]
    ? DOCTYPE_PATH_PREFIXES[docytype] + slug
    : slug;
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

/**
 * Inserts an ellipsis at the end of a string
 * @param {string} [text = ''] a text string to be truncated
 * @param {*} [charLimit = 1000000] the maximum character length of the string, after which the ellipsis should be inserted
 * @returns a truncated string
 */
export const truncateText = (text = '', charLimit = 1000000) => {
    let ellipsis = <span className='tracking-tighter'>...</span>;
    let truncatedText = '';
    if (text.length > charLimit) {
        truncatedText = <>
        text.substring(0, charLimit) + ellipsis</>
     }
     return truncatedText;
}

/**
 * Capitalizes the first character in a string
 * @param {*} [textString = ''] - string to be capitalized
 * @returns a capitalized string
 */
export const titleCase = (textString = '') => textString.charAt(0).toUpperCase() + textString.slice(1);


export const getCurrentSeason = () =>
    getSeasonFromMonthNumber(getCurrentMonthNumber());
