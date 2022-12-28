export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const getCurrentMonthName = () => {
    const CURRENT_MONTH_NAME = new Date(Date.now()).getMonth() + 1;
    return monthNames[CURRENT_MONTH_NAME - 1];
};

export const getCurrentMonthNumber = () => {
    const CURRENT_MONTH_NUMBER = new Date(Date.now()).getMonth() + 1;
    return CURRENT_MONTH_NUMBER;
};
