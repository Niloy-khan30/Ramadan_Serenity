const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getMonthKey = (date = getTodayDate()) => {
    const [year, month] = date.split("-");
    return `${year}-${month}`;
};

const getWeekNumber = (date) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const pastDays = Math.floor((d - firstDay) / 86400000);
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const getPeriodKey = (date, targetType) => {
    const [year] = date.split("-");

    if (targetType === "daily") return date;
    if (targetType === "weekly") return `${year}-W${getWeekNumber(date)}`;
    if (targetType === "monthly") return getMonthKey(date);

    return date;
};

const getDateDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.round((d2 - d1) / 86400000);
};

module.exports = {
    getTodayDate,
    getMonthKey,
    getPeriodKey,
    getDateDifference,
};