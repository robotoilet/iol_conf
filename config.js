var callsite = require('callsite')
  , fs = require('fs');

module.exports = function() {
  var config = {
    // database related (for sensor data)
    httpApi: "http://sensorDB:8086",
    dbName: "toilets",
    dataParsers: {
      regex: {
        chunk: /[^\n]+/g,
        seriesName: /^[^\(\s]+/,
        dataPoints: /\(([^)]+)/g
      }
    },
    // punters are the customers/toilet owners
    // TODO: this will live in a database, not here.
    punters: {
      punterX: {
        getPassword: function() {return "punterX"}, // :-)
        sites: {
          siteX: {
            series: {
              defaultSeries: {
                columns: ['time', 'line'],
                dataTypes: [parseInt, parseInt]
              },
              // SensorX: no configuration, defaultSensor shall be used
              SensorY: {
                columns: ['time', 'x', 'y'],
                dataTypes: [parseInt, parseFloat, parseInt]
              },
              // SensorY: no configuration, defaultSensor shall be used
              // sensorschmensor: no configuration, default Sensor shall be used
            }
          }
        }
      }
    }
  };
  var localConfig = callsite()[1].getFileName();
  if (fs.existsSync(localConfig)) {
    require(localConfig))(config);
  }
  return config;
}();
