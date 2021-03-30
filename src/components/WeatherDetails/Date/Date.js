import React from 'react';

import dateformat from 'dateformat';

import classes from './Date.module.css';

const date = (props) => {
    return(
        <div className={classes.DateWrapper}>
            {dateformat(props.date, "dddd, mmmm dd, h:mm TT")}
        </div>
    );
}

export default date;
