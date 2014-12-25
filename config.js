var path = require('path')
  , fs = require('fs');


module.exports = function() {
  var config = {
    // database related (for sensor data)
    httpApi: "http://sensorDB:8086",
    dbName: "toilets",
    checksums: {
      inUse: 'madeUp',
      madeUp: {
        bytesumLength: 6,
        filler: ':',
        lastNchars: 10
      }
    },
    dataParsers: {
      inUse: 'simple',
      simple: { // a datapoint contains all the information
        chunk: /[^\n]+/g,
        dataPoints: /\(([^)]+)/g
      },
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
              sensorMap: {
                a: 'SensorX',
                b: 'SensorY',
                c: 'SensorZ',
                d: 'sensorschmensor'
              },
              defaultSeries: {
                columns: ['time', 'line'],
                dataTypes: [function(s) {return parseInt(s) * 1000}, parseInt]
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

  // Check for local config overwrites; expects config.js in the directory of
  // the module initially called by node
  var mainDir = path.dirname(require.main.filename);
  // A hack in case the module we want is called by some of its dependencies as
  // in case of testing with mocha
  mainDir = mainDir.split('node_modules')[0];
  var localConfig = path.join(mainDir, 'config.js');
  if (fs.existsSync(localConfig)) {
    // updateCfg expected to be a function that can modify the config object
    var updateCfg = require(localConfig);
    updateCfg(config);
  }
  return config;
}();
