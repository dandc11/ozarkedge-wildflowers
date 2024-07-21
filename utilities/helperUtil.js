import React from 'react';

import { MONTH_NAMES_MAP } from './constants';
import { SEASONS } from './constants';
import { DOCTYPE_PATH_PREFIXES } from './constants';

/**
 * Returns the path for a given document type and slug
 * @param {string} [docytype=''] - The document type
 * @param {string} [slug=''] - The slug
 * @returns {string} The path for the given document type and slug
 */
export const getPathFromDocType = (docytype = '', slug = '') => {
    return DOCTYPE_PATH_PREFIXES[docytype]
        ? DOCTYPE_PATH_PREFIXES[docytype] + slug
        : slug;
};

/**
 * Returns the full name of the current month
 * @returns {string} The full name of the current month
 */
export const getCurrentMonthName = () => {
    const CURRENT_MONTH_NAME = new Date(Date.now()).getMonth() + 1;
    return MONTH_NAMES_MAP.get(CURRENT_MONTH_NAME).fullName;
};

/**
 * Returns the current month number
 * @returns {number} The current month number
 */
export const getCurrentMonthNumber = () => {
    const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1;
    return CURRENT_MONTH_NUMBER;
};

/**
 * Returns the season for a given month number
 * @param {number} [monthNum=0] - The month number
 * @returns {object|undefined} The season object for the given month number, or undefined if not found
 */
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
 * Returns the month numbers for a given season
 * @param {string} [season=''] - The season
 * @returns {array|undefined} The month numbers for the given season, or undefined if not found
 * */
export const getMonthNumbersFromSeason = (season) => {
    let currentTestSeason;
    for (const testSeason in SEASONS) {
        currentTestSeason = SEASONS[testSeason];
        if (currentTestSeason.SEASON_NAME === season) {
            return currentTestSeason.SEASON_MONTHS;
        }
    }
    return [];
}

/**
 * Returns the full name of a month from its number
 * @param {number} [monthNum=0] - The month number
 * @returns {string|undefined} The full name of the month, or undefined if not found
 */
export const getMonthNameFromMonthNumber = (monthNum) => {
    return MONTH_NAMES_MAP.get(monthNum);
};

/**
 * Inserts an ellipsis at the end of a string
 * @param {string} [text=''] - A text string to be truncated
 * @param {number} [charLimit=1000000] - The maximum character length of the string, after which the ellipsis should be inserted
 * @returns {string} A truncated string
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
 * Returns the background color and text color variables for a given conservation ranking
 * @param {string} conservationRanking - The conservation ranking
 * @returns {object} An object containing the background color variable, text color variable, and ranking text
 */
export const getNatureServeRankingColors = (conservationRanking) => {
    let bgColorVariable;
    let textLight = true;
    let textColorVariable = '--oe-white';
    let rankingText;

    switch (conservationRanking) {
        case 'presumedExtirpated':
            bgColorVariable = '--oe-presumed-extirpated';
            rankingText = 'Presumed Extirpated';
            break;
        case 'possiblyExtirpated':
            bgColorVariable = '--oe-possibly-extirpated';
            rankingText = 'Possibly Extirpated';
            break;
        case 'criticallyImperiled':
            bgColorVariable = '--oe-critically-imperiled';
            rankingText = 'Critically Imperiled';
            break;
        case 'imperiled':
            bgColorVariable = '--oe-imperiled';
            rankingText = 'Imperiled';
            textLight = false;
            break;
        case 'vulnerable':
            bgColorVariable = '--oe-vulnerable';
            rankingText = 'Vulnerable';
            textLight = false;
            break;
        case 'apparentlySecure':
            bgColorVariable = '--oe-apparently-secure';
            rankingText = 'Apparently Secure';
            textLight = false;
            break;
        case 'secure':
            bgColorVariable = '--oe-secure';
            rankingText = 'Secure';
            break;
        default:
            bgColorVariable = '--oe-gray-300';
            textLight = false;
            rankingText = 'Not Ranked';
            break;
    }
    if (!textLight) {
        textColorVariable = '--oe-black'
    }
    return { bgColorVariable, textColorVariable, rankingText };
}

/**
 * Capitalizes the first character in a string
 * @param {string} [textString=''] - The string to be capitalized
 * @returns {string} A capitalized string
 */
export const titleCase = (textString = '') => textString.charAt(0).toUpperCase() + textString.slice(1);


export const getCurrentSeason = () =>
    getSeasonFromMonthNumber(getCurrentMonthNumber());
