// Load required modules
const path = require('path');
const fs = require('fs'); // file system core module
const io = require('socket.io'); // web socket external module
const https = require('https'); // https server core module
const express = require('express'); // web framework external module

// This sample is using the easyrtc from parent folder.
// To use this server_example folder only without parent folder:
// 1. you need to replace this "require("../");" by "require("open-easyrtc");"
// 2. install easyrtc (npm i open-easyrtc --save) in server_example/package.json

const easyrtc = require('open-easyrtc'); // EasyRTC internal module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
const httpApp = express();
httpApp.use(express.static(path.join(__dirname, 'static')));
httpApp.use(express.static(path.join(__dirname, 'views/audio/js')));

httpApp.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/audio/demo_audio_rooms.html'));
});

httpApp.get('/test1', (req, res) => {
  // res.set({
  // 	'Content-Encoding': 'gzip',
  // 	'Content-Type': 'application/wasm',
  // 	'Content-Type': 'application/octet-stream',
  // 	'Content-Type': 'application/javascript',
  // })
  res.sendFile(path.join(__dirname, 'views/audio/demo_audio_webgl.html'));
});

// Start Express https server on port 8443
const webServer = https.createServer(
  {
    key: fs.readFileSync(__dirname + '/certs/localhost.key'),
    cert: fs.readFileSync(__dirname + '/certs/localhost.crt'),
  },
  httpApp,
);

// Start Socket.io so it attaches itself to Express server
const socketServer = io.listen(webServer, { 'log level': 1 });

// Cross-domain workaround presented below:
/*
socketServer.origins(function(origin, callback) {
	if (origin && ![
		'https://localhost:8080',
		'*'
	].includes(origin)) {
		return callback('origin not allowed', false);
	}
	callback(null, true);
});
*/

// Start EasyRTC server
const rtc = easyrtc.listen(httpApp, socketServer);

// Listen on port 8443
const PORT = 8443;
webServer.listen(PORT, function () {
  console.log(`listening on https://localhost:${PORT}`);
});
