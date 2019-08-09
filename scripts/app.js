window.addEventListener("load", () => {
  const key = " ";
  const country = document.querySelector("#country");
  const time = document.querySelector("#time");
  const sunrise = document.querySelector("#sunrise");
  const sinset = document.querySelector("#sunset");
  const description = document.querySelector("#description");
  const temp = document.querySelector("#temperature");
  const text = document.querySelector("#text_info");
  const icon = document.querySelector("#icon");
  const calendar = document.querySelector("#calendar_ui");
  setInterval(() => {
    time.innerHTML = getTime();
  }, 1000);
  getCoord(key, country, icon, description, temp, text, sunrise, sinset);
  calendarInit(calendar);
});
const getTextInfo = function(temperature, description) {
  const temp = Math.round(temperature);
  console.log(temp);
  if (temp >= 302) {
    if (
      description == "rain" ||
      description == "shower rain" ||
      description == "thunderstorm"
    ) {
      return "It's Cool";
    }
    return "It's Hot";
  } else if (temp < 302 && temp >= 300) {
    if (
      description == "rain" ||
      description == "shower rain" ||
      description == "thunderstorm"
    ) {
      return "It's Cool";
    }
    return "It's Warm";
  } else if (temp < 300 && temp > 295) {
    return "It's Cool";
  } else if (temp < 295 && temp > 288) {
    return "It's Cold";
  } else {
    return "It's very Cold";
  }
};
const convertKelvin = function(value, to) {
  if (to == "celsius") {
    return Math.round((value - 273.15) * 100) / 100 + " C&deg";
  } else if (to == "Fahrenheit") {
    return Math.round(((value * 9) / 5 - 459.67) * 100) / 100 + " F&deg";
  }
};

const getTime = function(unix_time) {
  let date = new Date();
  if (unix_time) {
    date = new Date(unix_time * 1000);
  }
  const hours = date.getHours();
  const am_pm = hours >= 12 ? "pm" : "am";
  const new_hours = hours % 12;
  const twelve_hours_format = new_hours ? new_hours : 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${twelve_hours_format}:${minutes}:${seconds} ${am_pm}`;
};

const getCoord = function(
  key,
  country,
  icon,
  description,
  temp,
  text_info,
  sunrise,
  sunset,
) {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        // console.log(lat, long);
        fetch(
          // `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`,
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}2&lon=${long}&appid=${key}`,
        )
          .then(response => response.json())
          .then(data => {
            // console.log(JSON.stringify(data));
            country.textContent = data.sys.country;
            icon.src = `http://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png`;
            description.textContent = data.weather[0].description;
            temp.innerHTML = convertKelvin(data.main.temp, "celsius");
            text_info.textContent = getTextInfo(data.main.temp);
            sunrise.textContent = getTime(data.sys.sunrise);
            sunset.textContent = getTime(data.sys.sunset);
          });
      },
      error => {
        if (error.code == error.PERMISSION_DENIED) {
          console.log("you denied me");
        }
      },
    );
  } else {
    console.log("false");
  }
};
const calendarInit = function(calendar) {
  console.log(calendar);
  const date_full = new Date();
  // we get the numbe of days this month
  const num_of_days = new Date(
    date_full.getFullYear(),
    date_full.getMonth() + 1,
    0,
  );
  // we get the day of the first date
  const start_day = new Date(
    date_full.getFullYear(),
    date_full.getMonth(),
    1,
  ).getDay();
  const date_start = 1;
  console.log(num_of_days);
  for (let i = 0; i < 6; i++) {
    const row_div = document.createElement("div");
    row_div.classList.add("row-div", "a");
    calendar.appendChild(row_div);

    for (let j = 0; j < 7; j++) {
      const column_div = document.createElement("div");
      const text = document.createTextNode(" ");
      column_div.appendChild(text);
      column_div.classList.add("column-div");
      row_div.appendChild(column_div);
    }
    calendar.appendChild(row_div);
  }
};
