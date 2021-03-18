import React from 'react';

import dateformat from 'dateformat';

import classes from './Date.module.css';

const date = (props) => {
    const today = new Date();
    let nextDay = new Date();
    nextDay.setDate(today.getDate() + props.day);
    return(
        <div className={classes.DateWrapper}>
            {dateformat(nextDay, "dddd, mmmm dd")}
        </div>
    );
}

export default date;
