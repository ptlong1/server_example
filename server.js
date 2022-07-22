require('dotenv').config();
var http = require('http'); // http server core module
var path = require('path');
var express = require('express'); // web framework external module
var serveStatic = require('serve-static'); // serve static files
var socketIo = require('socket.io'); // web socket external module
var easyrtc = require('open-easyrtc'); // EasyRTC internal module

// Set process name
process.title = 'node-easyrtc';

var app = express();
app.use(serveStatic('static', { index: ['index.html'] }));
// app.use(express.static('Multiplayer-WebGL'));
app.use(express.static(path.join(__dirname, 'views/audio/js')));

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/audio/demo_audio_rooms.html'));
});
app.get('/test1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/audio/demo_audio_webgl.html'));
});

var webServer = http.createServer(app);

var socketServer = socketIo.listen(webServer, { 'log level': 1 });

easyrtc.setOption('logLevel', 'debug');

easyrtc.events.on(
  'easyrtcAuth',
  function (socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(
      socket,
      easyrtcid,
      msg,
      socketCallback,
      function (err, connectionObj) {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
          callback(err, connectionObj);
          return;
        }

        connectionObj.setField('credential', msg.msgData.credential, {
          isShared: false,
        });

        console.log(
          '[' + easyrtcid + '] Credential saved!',
          connectionObj.getFieldValueSync('credential'),
        );

        callback(err, connectionObj);
      },
    );
  },
);

easyrtc.events.on(
  'roomJoin',
  function (connectionObj, roomName, roomParameter, callback) {
    console.log(
      '[' + connectionObj.getEasyrtcid() + '] Credential retrieved!',
      connectionObj.getFieldValueSync('credential'),
    );
    easyrtc.events.defaultListeners.roomJoin(
      connectionObj,
      roomName,
      roomParameter,
      callback,
    );
  },
);

var rtc = easyrtc.listen(app, socketServer, null, function (err, rtcRef) {
  console.log('Initiated');

  rtcRef.events.on(
    'roomCreate',
    function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {
      console.log('roomCreate fired! Trying to create: ' + roomName);

      appObj.events.defaultListeners.roomCreate(
        appObj,
        creatorConnectionObj,
        roomName,
        roomOptions,
        callback,
      );
    },
  );
});

// Listen on port 8443
const PORT = process.env.PORT || 8443;
webServer.listen(PORT, function () {
  console.log(`listening on http://localhost:${PORT}`);
});
