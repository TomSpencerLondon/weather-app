import React, { Component } from 'react';

import { MoonLoader } from 'react-spinners';
import styled from "styled-components";

import classes from './App.module.css';
import assetMapping from '../../assets/assetMapping.json';
import Card from '../../elements/Card/Card';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SearchBar from '../../components/SearchBar/SearchBar';
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails';
import Preview from '../../components/Preview/Preview';
import ErrorNotice from '../../components/ErrorNotice/ErrorNotice';
import { getWeather } from '../../api/getWeather'


const StyledButton = styled.button`
  font-size: 0;
  line-height: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: transparent;
  border: none;
  outline: 0;
  background: 0 0;

  &::before {
    content: ">" !important;
    font-size: 30px;
    line-height: 1;
    color: black;
    background: none;
    width: 32px;
    height: 32px;
    border-style: none;
  }
`
const BackButton = styled(StyledButton)`
  &::before {
    content: "<" !important;
  }
  margin-right: 8px;
`

class App extends Component {

  state = {
    searchBarInput: '',
    weatherDetails: [],
    loading: false,
    error: false,
    reportIndex: 0
  }

  // Update state with current search bar input
  searchBarHandler = (e) => {
    this.setState({
      searchBarInput: e.target.value
    })
  }

  // Reset state after clicking on Logo or Try Again button
  tryAgainHandler = () => {
    this.setState({
      searchBarInput: '',
      weatherDetails: [],
      error: false
    })
  }

  // Fetch weather information and update state
  setWeather = async () => {
    const weather = await getWeather(this.state.searchBarInput);
    console.log(weather);
    if (weather.error){
      this.setState({
        loading: false,
        error: true
      })
    }else {
      this.setState({
        weatherDetails: weather.weatherDetails,
        loading: false
      })
    }
  }

  increaseDay = () => {
    if(this.state.reportIndex >= this.state.weatherDetails.length - 1){
      return;
    }

    this.setState({
      reportIndex: this.state.reportIndex + 1
    })
  }

  decreaseDay = () => {
    if(this.state.reportIndex === 0){
      return;
    }
    this.setState({
      reportIndex: this.state.reportIndex - 1
    })
  }
  // We want to:
  // 1. refactor App - check variable names, extract inline logic, API call separate, extras: [change to typescript, functional components to replace class]
  // 2. What is current date, which report index are we on (flawed + creates more work) -
  // 3 hourly report - use date time from API - then pass through date object as time stamp
  // - convert to date straight away. Strong definition of typescript.
  render() {

    // Conditionally render card content
    let cardContent = <Preview />;
    if (this.state.loading) {
      cardContent = <MoonLoader />;
    } else if (this.state.error) {
      cardContent = <ErrorNotice onClickHandler={this.tryAgainHandler} />;
    } else if (this.state.weatherDetails.length > 0 && this.state.weatherDetails[this.state.reportIndex].temperature && this.state.weatherDetails[this.state.reportIndex].description !== '') {
      // Display weather information if temperature and description exists
      cardContent = <WeatherDetails report={this.state.weatherDetails[this.state.reportIndex]} />;
    }

    return (
      <div className={classes.AppWrapper}>
        <Header
          color={assetMapping.colors[
            // Set header color based on weather condition; if error, set color to red
            (this.state.error) ? "error" : this.state.weatherDetails.length > 0 ? this.state.weatherDetails[0].description : ""
            ]}
          onClickHandler={this.tryAgainHandler} />
        <main className={classes.AppMain}>
          <SearchBar
            value={this.state.searchBarInput}
            onChangeHandler={this.searchBarHandler}
            onClickHandler={this.setWeather}
            error={this.state.error} />
          <div className={classes.Content}>
            <BackButton onClick={this.decreaseDay}>Default</BackButton>
            <Card>
              {cardContent}
            </Card>
            <StyledButton onClick={this.increaseDay}>Default</StyledButton>
          </div>
        </main>
        <Footer onClickHandler={this.tryAgainHandler} />
      </div>
    );
  }
}

export default App;
