const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const WeatherButton = require('./WeatherButton.jsx');
// require('./LocalStorage.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      location: "Denver"
    };
  }

  componentDidMount(){
    let that = this;
    const mostRecentLocation = JSON.parse(localStorage.getItem("location"));
    this.setState({location: mostRecentLocation ? mostRecentLocation : "Denver"});
  } //end of componentDidMount

  getWeatherData() { //when they click on Get Weather button
    let that = this;
    let city = this.state.location.toUpperCase();
    let target;
    if (city === "DENVER") {
      target = "denver";
    }
    else if (city === "SAN DIEGO") {
      target = "san-diego";
    }
    else if (city === "CASTLE ROCK") {
      target = "castle-rock";
    }
    else if (city === "SAN FRANCISCO") {
      target = "san-fransico";
    }
    else {
      changeWindow(city);
    }

    $.get("http://weatherly-api.herokuapp.com/api/weather/" + target, function (data) {
      that.setState({weather:data});
    });

    localStorage.setItem("location", JSON.stringify(this.state.location));

    function changeWindow(city) {
      let urlAssignment = "https://www.google.com/search?q=weather&ie=utf-8&oe=utf-8#q=weather+";
      let newAssignment = urlAssignment + city;
      window.open(newAssignment);
    }

  } //end of getWeatherData

  handleInputChange(e) { //when they enter data into location field
    this.setState({location: e.target.value});
  }

  enterFunctionality(e) {
    let that = this;
    if (e.keyCode === 13) {
      that.getWeatherData();
    }
  }

  render () {
    return (
      <div className="GetWeather">

        <header className={this.state.location}>
          <h1>Welcome to Weathrly</h1>

          <h3>Your World<br></br>Your Weather</h3>
        </header>
        <fieldset>
                  <label htmlFor="current-location-input" className="fieldset-left-item">Your Current Location:
                  <input id="current-location-input" type="text" placeholder="City" list="current-loc-list" onChange={this.handleInputChange.bind(this)} value={this.state.location} onKeyDown={this.enterFunctionality.bind(this)}>
                  </input>
                  <datalist id="current-loc-list">
                    <option value="San Diego"></option>
                    <option value="Denver"></option>
                    <option value="San Francisco"></option>
                    <option value="Castle Rock"></option>
                  </datalist>
                  </label>
                </fieldset>
            <WeatherButton id = 'get-weather-button' text="Get Weather" handleClick={()=>this.getWeatherData()} />
            <WeatherList data={this.state.weather} city={this.state.location}/>

      </div> //end of GetWeather
    );
  }
} //end of App

class WeatherList extends React.Component {
  constructor(props) {
    super(props);
  }

  showWeatherData(data) {

    let condition = data.weatherType.type;
    let chooseIcon = {
      'cloudy': '../../images/cloudy2.png',
      'foggy': '../../images/foggy.png',
      'rain': '../../images/rain2.png',
      'snow': '../../images/snowflake2.png',
      'sunny': '../../images/sun.png',
      'thunder storms': '../../images/thunder.png',
      'windy': '../../images/wind.png',
    } //end of chooseIcon

    return(<div className="weather-card">
            <p className='date'>{data.date}</p>
            <img alt="weather icon" className='symbol' src={chooseIcon[condition]}/>
            <p className="weather-card-text1"> The weather will be {data.weatherType.type} with a high of {data.temp.high} and a low of {data.temp.low}.</p>
            <p className="weather-card-text2">There will be a {Math.floor(data.weatherType.chance * 100)} percent chance of this weather event happening.
          </p>
        </div>)

}; //end of showWeatherData

  showExtremeWeather(data) {
    let condition = data.weatherType.type;
    let extremeness = data.weatherType.scale;

    let chooseCondition1 = {
      'sunny': 'There will be extreme sun.',
      'rain': 'There will be a high chance of flooding and extreme rain.',
      'windy': 'There will be very high winds.',
      'snow': 'There will be heavy snow!',
      'foggy': 'There will be heavy fog.'
    } //end of chooseCondition1

    let chooseCondition2 = {
      'sunny': 'Take care and use plenty of sunscreen!',
      'rain': "Stay inside and don't drive if possible!",
      'windy': 'Stay indoors!',
      'snow': 'Take precautions!',
      'foggy': 'Be aware that driving visibility will be extremely limited.'
    } //end of chooseCondition2

    if (extremeness === 3) {
      return(<div className="warning">
      <p className='date'>{data.date}</p>
      <img alt='extreme weather warning icon' className='symbol' src='../../images/alert.png'/>
      <p className="weather-card-text1">{chooseCondition1[condition]}</p>
      <p className="weather-card-text2">{chooseCondition2[condition]}</p>

      </div>);

    }
  } //end of showExtremeWeather

  render () {
    return (
      <ul>
        <li>{this.props.data.map(this.showExtremeWeather)}</li>
        <li>{this.props.data.map(this.showWeatherData)}</li>
      </ul>
    );
  }
} //end of WeatherList

ReactDOM.render(<App title='Weathrly' />, document.querySelector('#application'));
module.exports = App
