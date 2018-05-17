  //------------------- Node Js Libraries imports -------------------//

  //modules "require()" (same idea of #includes or Imports)
  const express = require('express'); //used as routing framework
  const app = express(); //creates an instance of express

  const path = require('path'); //Node.js module used for getting path of file
  const logger = require('morgan'); //used to log in console window all request
  const cookieParser = require('cookie-parser'); //Parse Cookie header and populate req.cookies
  const bodyParser = require('body-parser'); //allows the use of req.body in POST request
  const http = require('http');
  const request = require('request'); // Make HTTP request inside Node.js
  const fs = require('fs'); // file system
  const ip = require('ip'); // to get IP info on Pi


  //------------------- side files with info -------------------//

  // underscore represents loaded from other files
  const _printers = require('./keys.js'); // needs to be added manually from drive
  const _colors = require('./colors.js');

  //------------------- Express JS settings -------------------//

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'front')));

  //------------------- setup info -------------------//

  // Makes folder for printer images to be saved in under ./printerImages/
  const IMAGE_FOLDER = "./printerImages";
  if (!fs.existsSync(IMAGE_FOLDER)) {
      fs.mkdirSync(IMAGE_FOLDER);
  }

  // Template for request options
  /*
  var option = {
    "url": "",
    "headers": {
      "Content-Type" : "application/json"
    },
    "auth" : {
      "user" : _printers.keys[0].id,
      "pass" : _printers.keys[0].key,
      "sendImmediately" : false
      },
      "body" : JSON.stringify({})
  };
  */

  //--------------- API calls from front end GUI -------------------//

  function errorCheck(err, response, body) {
    if (err) { console.error(err); }
  }

  app.get('/rainbow', function(req, res, next) {
    _printers.keys.forEach(function(printer, index) {
      var randomIndex = Math.floor(Math.random() * _colors.rainbow.length);
      var color = _colors[_colors.rainbow[randomIndex]];
      request.put({
        "url": "http://" + printer.ip + "/api/v1/printer/led",
        "headers": {
          "Content-Type" : "application/json"
        },
        "auth" : {
          "user" : printer.id,
          "pass" : printer.key,
          "sendImmediately" : false
        },
        "body" : JSON.stringify(color)
      }, errorCheck);
    });
    res.send("Good");
  })

  app.get('/white', function(req, res) {
    _printers.keys.forEach(function(printer, index) {
      request.put({
        "url": "http://" + printer.ip + "/api/v1/printer/led",
        "headers": {
          "Content-Type" : "application/json"
        },
        "auth" : {
          "user" : printer.id,
          "pass" : printer.key,
          "sendImmediately" : false
        },
        "body" : JSON.stringify(_colors.white)
      }, errorCheck);
    });
    res.send("Good");
  });

  app.get('/bucky', function(req, res) {
    _printers.keys.forEach(function(printer, index) {
      var color = (index % 2 == 0) ? _colors.white : _colors.red;
      request.put({
        "url": "http://" + printer.ip + "/api/v1/printer/led",
        "headers": {
          "Content-Type" : "application/json"
        },
        "auth" : {
          "user" : printer.id,
          "pass" : printer.key,
          "sendImmediately" : false
        },
        "body" : JSON.stringify(color)
      }, errorCheck);
    });
    res.send("Good");
  });

  app.get('/active', function(req, res) {
    activeMode = true;
    return res.send("Good");
  });

  app.get('/printerList', function(req, res) {
    return res.json({"list" : _printers.nameList() });
  });

  app.post('/printerInfo', function(req, res) {
    // Assuming req.body.name is always valid
    var printer = _printers.getBySerial(req.body.serial);
    if (inactiveList.indexOf(printer.serial) >= 0) {
      // is inactive
      return res.json({
        "active" : false,
        "name" : printer.name
      });
    } else {
      return res.json({
        "active" : true,
        "name" : printer.name
      });
    }
  });

  app.post('/setStatus', function(req, res) {
    var index = _printers.getIndexBySerial(req.body.serial);
    _printers.keys[index].manualStatus = req.body.status;
    res.send("Good");
  });
  //-------------- Ultimaker 3 API Functions ----------------------//

  var TIMEOUT_MAX = 1500; // ms
  var activeMode = false;
  var inactiveList = [];

  // gather all details from printers
  // callback hell is real, not time to do it propery with ES6 aync awaits
  function printerCheck() {
    _printers.keys.forEach(function(printer, index) {
      printerRequest(printer, "system/name", function(err, body) {
        if (!err) { printer.name = body; } else {return;}
        printerRequest(printer, "print_job/time_elapsed", function(err, body) {
          if (!err) { printer.timeElapsed = body; } else {return;}
          printerRequest(printer, "print_job/time_total", function(err, body) {
            if (!err) { printer.timeTotal = body; } else {return;}
            printerRequest(printer, "printer/status", function(err, body) {
              if (!err) { printer.autoStatus = body; } else {return;}
              printerRequest(printer, "camera/0/snapshot", function(err, body) {
                // Do camera last
                if (!err) { updateSnapshot(printer); }
              });
            });
          });
        });
      });
    });
  }

  function updateSnapshot(printer) {
    request.get("http://" + printer.ip + ":8080/?action=snapshot")
    .on('error', function(err) {
      console.log(err);
    })
    .pipe(fs.createWriteStream(IMAGE_FOLDER + "/" + printer.imageName))
  }

  function printerRequest(printer, api, callback) {
    request.get("http://" + printer.ip + "/api/v1/" + api, {timeout: TIMEOUT_MAX}, function(err, response, body) {        
      if (err && err.code === 'ETIMEDOUT') {
        console.log(printer.name + " has timeout");
        if (inactiveList.indexOf(printer.serial) == -1) {
          inactiveList.push(printer.serial);
        }
        callback(true);
      } else {
        inactiveList.splice(inactiveList.indexOf(printer.serial), 1); // remove from list
        callback(false, body);
      }
    })
  }

  // ------------ ON BOOT task --------------//
  const PRINTER_CHECK_INTERVAL = 60 * 1000; // ms

  // Start looping to get Printer status
  setInterval(printerCheck, PRINTER_CHECK_INTERVAL);

  // an initial sweep of printer check before updateLoop first interval goes off
  printerCheck();

  // ------------ Server Setup --------------//

  // Get port from environment and store in Express
  const port = normalizePort(process.env.PORT || '9000');
  app.set('port', port);

  // Create HTTP server
  const server = http.createServer(app);

  // Listen on provided port, on all network interfaces
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  // Normalize a port into a number, string, or false
  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  // Event listener for HTTP server "error" event
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  // Event listener for HTTP server "listening" event
  function onListening() {

    var addr = server.address();
    console.log('Server up and running. See it at: ');
    console.log(ip.address() + ":" + addr.port);
  }
