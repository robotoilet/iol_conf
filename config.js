var path = require('path')
  , fs = require('fs');


function updateConfig(configToUpdate, path2cfg) {
  if (fs.existsSync(path2cfg)) {
    // updateCfg expected to be a function that can modify the config object
    var updateCfg = require(path2cfg);
    updateCfg(configToUpdate);
  }
}

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
                dataTypes: [function(s) {return parseInt(s) * 1000}, parseFloat, parseInt]
              },
              // SensorY: no configuration, defaultSensor shall be used
              // sensorschmensor: no configuration, default Sensor shall be used
            }
          }
        }
      }
    }
  };

  // Check for config overwrites (for testing and/or local specifics);
  // Local overwrites expect config.js (test-config.js) in the directory of the
  // module initially called by node
  var mainDir = path.dirname(require.main.filename);

  // For later: check whether the caller is our test framework (mocha)
  isMocha = mainDir.match('mocha');

  // A hack in case the module we want is called by some of its dependencies as
  // in case of testing with mocha
  mainDir = mainDir.split('node_modules')[0];

  // a local config updates the global config..
  updateConfig(config, path.join(mainDir, 'config.js'));

  if (isMocha) {
    // a global test config updates local and global non-test configs..
    require('./test-config.js')(config);

    // a local test config updates all others
    updateConfig(config, path.join(mainDir, 'test-config.js'));
  }
  return config;
}();
