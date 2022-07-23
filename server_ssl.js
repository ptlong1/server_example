// Load required modules
const path = require('path');
const fs = require('fs'); // file system core module
const io = require('socket.io'); // web socket external module
const https = require('https'); // https server core module
const express = require('express'); // web framework external module

const easyrtc = require('open-easyrtc'); // EasyRTC internal module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
const httpApp = express();
httpApp.use(express.static(path.join(__dirname, 'static')));
httpApp.use(express.static(path.join(__dirname, 'views/audio/js')));

httpApp.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/audio/demo_audio_rooms.html'));
});

httpApp.get('/test1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/audio/demo_audio_webgl.html'));
});

httpApp.get('/test1', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/demo_audio_webgl.html'));
});

// Start Express https server on port 8443
const webServer = https.createServer(
  {
    key: fs.readFileSync(__dirname + '/certs/localhost+2-key.pem'),
    cert: fs.readFileSync(__dirname + '/certs/localhost+2.pem'),
  },
  httpApp,
);

// Start Socket.io so it attaches itself to Express server
const socketServer = io.listen(webServer, { 'log level': 1 });

// Start EasyRTC server
const rtc = easyrtc.listen(httpApp, socketServer);

// Listen on port 8443
const PORT = 8443;
webServer.listen(PORT, function () {
  console.log(`listening on https://localhost:${PORT}`);
});
