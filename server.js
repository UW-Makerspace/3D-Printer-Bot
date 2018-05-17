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

//--------------- API calls from front end GUI -------------------//

app.get('/rainbow', function(req, res, next) {
  res.send("Good");
})

app.get('/white', function(req, res, next) {
  res.send("Good");
});

app.get('/bucky', function(req, res, next) {
  res.send("Good");
});

app.get('/active', function(req, res, next) {
  res.send("Good");
});

//-------------- Ultimaker 3 API Functions ----------------------//

// Main loop that checks printers every set interval
const LOOP_INTERVAL = 5000; // ms
function updateLoop() {
  console.log("update");
}

function updateSnapshot(printer, callback) {
  option.url = "http://" + printer.ip + "/api/v1/camera/0/snapshot";

  request.get(option.url, function(error, response, body) {
      if (error) { console.log(error); }

      option.url = "http://" + printer.ip + ":8080/?action=snapshot";
      request.get(option.url)
    .on('error', function(err) {
        console.log(err);
    })
    .pipe(fs.createWriteStream(IMAGE_FOLDER + "/" + printer.imageName))
    
    callback();  
  });
}

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

  // Start looping to get Printer status
  setInterval(updateLoop, LOOP_INTERVAL);

  var addr = server.address();
  console.log('Server up and running. See it at: ');
  console.log(ip.address() + ":" + addr.port);
}
