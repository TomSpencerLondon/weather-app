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
  setWeather = () => {
    const city = this.state.searchBarInput;
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
    const URL = API_URL + `?q=${city}&appid=${API_KEY}&units=metric`;
    this.setState({
      weatherDetails: [],
      loading: true,
      error: false
    }, () => {
      // Executed as callback function
      fetch(URL)
        .then(res => res.json())
        .then(data => {
          // If city exists, update weather details
          if(data.cod === "200") {
            this.setState({
              weatherDetails: data.list.map((el) => ({
                temperature: el.main.temp,
                description: el.weather[0].main,
                timestamp: el.dt_txt
              })),
              loading: false
            });
          } else {
            // If city doesn't exist, throw error
            throw data.cod
          }
        })
        .catch(err => {
          this.setState({
            loading: false,
            error: true
          });
        });
    });
  }

  increaseDay = () => {
    if(this.state.reportIndex >= this.state.weatherDetails.length - 1){
      return;
    }

    this.setState({
      day: this.state.reportIndex + 1
    })
  }

  decreaseDay = () => {
    if(this.state.reportIndex === 0){
      return;
    }
    this.setState({
      day: this.state.reportIndex - 1
    })
  }

  render() {

    // Conditionally render card content
    let cardContent = <Preview />;
    console.log(this.state);
    if (this.state.loading) {
      cardContent = <MoonLoader />;
    } else if (this.state.error) {
      cardContent = <ErrorNotice onClickHandler={this.tryAgainHandler} />;
    } else if (this.state.weatherDetails.length > 0 && this.state.weatherDetails[this.state.reportIndex].temperature && this.state.weatherDetails[this.state.reportIndex].description !== '') {
      // Display weather information if temperature and description exists
      cardContent = <WeatherDetails data={this.state.weatherDetails[this.state.reportIndex]} day={Math.floor(this.state.reportIndex  / 8)} />;
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
