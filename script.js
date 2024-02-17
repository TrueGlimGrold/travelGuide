// Fetch the JSON data from countries.json
document.addEventListener('DOMContentLoaded', function() {
    fetch('countries.json')
      .then(response => response.json())
      .then(data => {
        const countries = data.countries;
        const datalist = document.getElementById('country-choice');
  
        // Generate options for each country
        countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country.name;
          datalist.appendChild(option);
        });
  
        // Event listener for input change
        const input = document.querySelector('input[name="country"]');
        const languagesDiv = document.getElementById('languages');
        const expensesDiv = document.getElementById('expenses');
        const timezoneDiv = document.getElementById('timezone');
        const imagesDiv = document.getElementById('images-div');
        const imagesTitle = document.getElementById('images-title');
  
        input.addEventListener('input', function() {
          const selectedCountry = countries.find(country => country.name === input.value);
  
          if (selectedCountry) {
            // Update languages
            const languages = selectedCountry.languages;
            languagesDiv.innerHTML = ''; // Clear existing languages
            languages.forEach(language => {
              const languageElement = document.createElement('h2');
              languageElement.textContent = language;
              languagesDiv.appendChild(languageElement);
            });
  
            // Update expenses
            expensesDiv.textContent = `Average Cost of Living: ${selectedCountry.average_cost_of_living}/135`;
  
            // Calculate current time using UTC offset range
            const now = new Date();
            const offsetRange = selectedCountry.time_zone.split(' to ');
            let currentTime = 'Invalid Date';

            offsetRange.forEach(offset => {
              const offsetMilliseconds = parseInt(offset.replace('UTC', '')) * 60 * 60 * 1000;
              const time = new Date(now.getTime() + offsetMilliseconds);
              if (time.getTime() === time.getTime()) { // Check if it's a valid date
                currentTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              }
            });

            timezoneDiv.textContent = `Time Zone: ${selectedCountry.time_zone} | Currently: ${currentTime}`;

            // Fetch images from Unsplash API
            fetch(`https://api.unsplash.com/search/photos?query=${selectedCountry.name}&per_page=10&client_id=EOLFJ3rKsqknzUFfXshPfkpceTAbJ-x3-2KF4L2wuBA`)
            .then(response => response.json())
            .then(data => {
                imagesDiv.innerHTML = `<p id="images-title">At a glance</p>`; // Reset imagesDiv content
                data.results.forEach(result => {
                const imageElement = document.createElement('img');
                imageElement.src = result.urls.small;
                imageElement.style.margin = '20px'; // Set margin to 20px
                imagesDiv.appendChild(imageElement);
                });
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
            // Set the capital city for the weather API request
            fetch(`https://restcountries.com/v3.1/name/${selectedCountry.name}`)
            .then(response => response.json())
            .then(data => {
              const capital = data[0].capital;
              console.log(`The capital of ${selectedCountry.name} is ${capital}`);

              // Fetch weather data from OpenWeatherMap API
              // Fetch weather data from OpenWeatherMap API
              fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=397beab79461c513bd642465093b5dff&units=metric`)
              .then(response => response.json())
              .then(weatherData => {
                  const temperatureDiv = document.getElementById('temperature'); // Get the temperature div
                  const temperature = weatherData.main.temp;
                  temperatureDiv.textContent = `Temperature: ${temperature}°C`;

                  // Get the weather condition code
                  const weatherConditionCode = weatherData.weather[0].icon;

                  // Update the weather icon
                  const weatherIcon = document.getElementById('weather-icon');
                  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherConditionCode}.png`;
              })
              .catch(error => {
                  console.error('Error fetching weather data:', error);
                  const temperatureDiv = document.getElementById('temperature'); // Get the temperature div
                  temperatureDiv.textContent = 'Temperature: N/A';
              });
            })
            .catch(error => {
              console.error('Error fetching capital:', error);
            });
          } else {
            // Reset all divs if no country selected
            languagesDiv.innerHTML = '<h2 class="placeholder-content">No country selected</h2>';
            expensesDiv.textContent = '- expenses -';
            timezoneDiv.textContent = '- timezone -';
            imagesDiv.innerHTML = '<h2 class="placeholder-content">No images available</h2>';
            imagesTitle.textContent = 'At a glance';
          }
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });

// edge does not support the autofill feature. 