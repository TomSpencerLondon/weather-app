import React from 'react';

import classes from './WeatherDetails.module.css';
import Icon from '../../elements/Icon/Icon';
import Temperature from './Temperature/Temperature';
import Description from './Description/Description';
import Date from './Date/Date';

const weatherDetails = (props) => {
    return(
        <div className={classes.WeatherDetailsWrapper}>
            <div className={classes.WeatherIconWrapper}>
                <Icon type={props.report.description} />
            </div>
            <div className={classes.WeatherDataWrapper}>
                <Temperature degrees={props.report.temperature} />
                <Description type={props.report.description} />
                <Date date={props.report.date}/>
            </div>
        </div>
    );
}

export default weatherDetails;
