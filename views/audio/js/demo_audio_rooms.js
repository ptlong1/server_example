var selfEasyrtcid = '';
var currentRoomName = 'default';
var isJoinRoom = false;

var isEnableMicrophone = false;

function connect() {
  console.log('Initializing.');
  easyrtc.enableVideo(false);
  easyrtc.enableVideoReceive(false);
  easyrtc.setRoomOccupantListener(convertListToButtonsAndCall);
  joinRoom('MainRoom');
  currentRoomName = 'MainRoom';
  easyrtc.initMediaSource(
    function () {
      // success callback
      easyrtc.connect('easyrtc.audioOnly', loginSuccess, loginFailure);
      // connectRoom("MainRoom");
    },
    function (errorCode, errmesg) {
      easyrtc.showError(errorCode, errmesg);
    }, // failure callback
  );
}

function connectInputRoom() {
  var newRoomName = document.getElementById('roomNameInput').value;
  connectRoom(newRoomName);
}
function connectRoom(newRoomName) {
  newRoomName = newRoomName.replace(/\s/g, '');
  console.log('New Room Name: ' + newRoomName);
  leaveRoom(currentRoomName);
  currentRoomName = '';
  joinRoom(newRoomName);
}

function joinRoom(roomName) {
  console.log('Joining room...', roomName);
  isJoinRoom = true;
  easyrtc.joinRoom(roomName, null, joinRoomSuccessCB, joinRoomFailureCB);
  console.log('Joined room: ', roomName);
}

function leaveRoom(roomName) {
  isJoinRoom = false;
  easyrtc.hangupAll();
  easyrtc.leaveRoom(
    roomName,
    function (roomName) {
      console.log('No longer in room ' + roomName);
      document.getElementById('roomName').innerHTML =
        'Room name: not available';
    },
    function (errorCode, errorText, roomName) {
      console.log('had problems leaving ' + roomName);
    },
  );
}
function joinRoomSuccessCB(roomName) {
  currentRoomName = roomName;
  easyrtc.setRoomOccupantListener(convertListToButtonsAndCall);
  document.getElementById('roomName').innerHTML =
    'Room name: ' + currentRoomName;
}

function joinRoomFailureCB(errorCode, errorText, roomName) {
  console.log(selfEasyrtcid + ' cannot enter room ' + roomName);
}

function clearConnectList() {
  otherClientDiv = document.getElementById('otherClients');
  while (otherClientDiv.hasChildNodes()) {
    otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
}
function convertListToButtonsAndCall(roomName, occupants, isPrimary) {
  easyrtc.setRoomOccupantListener(convertListToButtons);
  clearConnectList();
  console.log('Ready to perform call');
  var otherClientDiv = document.getElementById('otherClients');
  for (var easyrtcid in occupants) {
    var button = document.createElement('button');
    // button.onclick = function(easyrtcid) {
    //     return function() {
    //         performCall(easyrtcid);
    //     };
    // }(easyrtcid);
    performCall(easyrtcid);
    var label = document.createElement('text');
    label.innerHTML = easyrtc.idToName(easyrtcid);
    button.appendChild(label);
    otherClientDiv.appendChild(button);
  }
}
function convertListToButtons(roomName, occupants, isPrimary) {
  // easyrtc.setRoomOccupantListener(null);
  clearConnectList();
  console.log('Ready to perform call');
  var otherClientDiv = document.getElementById('otherClients');
  for (var easyrtcid in occupants) {
    var button = document.createElement('button');
    // button.onclick = function(easyrtcid) {
    //     return function() {
    //         performCall(easyrtcid);
    //     };
    // }(easyrtcid);
    // performCall(easyrtcid);
    var label = document.createElement('text');
    label.innerHTML = easyrtc.idToName(easyrtcid);
    button.appendChild(label);
    otherClientDiv.appendChild(button);
  }
}

function performCall(otherEasyrtcid) {
  console.log('here');
  // easyrtc.hangupAll();
  var acceptedCB = function (accepted, caller) {
    if (!accepted) {
      easyrtc.showError(
        'CALL-REJECTED',
        'Sorry, your call to ' + easyrtc.idToName(caller) + ' was rejected',
      );
      enable('otherClients');
      console.log('call not accepted by ' + easyrtc.idToName(caller));
    } else {
      console.log('call accepted by ' + easyrtc.idToName(caller));
    }
  };
  var successCB = function () {
    // enable('hangupButton');
    console.log('Call Success');
  };
  var failureCB = function () {
    enable('otherClients');
    console.log('Call failure');
  };
  console.log(easyrtc.getConnectStatus(otherEasyrtcid));
  if (easyrtc.getConnectStatus(otherEasyrtcid) == easyrtc.NOT_CONNECTED) {
    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
    console.log('After call: ' + easyrtc.getConnectStatus(otherEasyrtcid));
  } else {
    console.log('already connect to ' + otherEasyrtcid);
  }
}

function loginSuccess(easyrtcid) {
  disable('connectButton');
  // enable("disconnectButton");
  enable('otherClients');
  selfEasyrtcid = easyrtcid;
  document.getElementById('iam').innerHTML = 'I am ' + easyrtcid;
  // default: turn on microphone
  isEnableMicrophone = false;
  easyrtc.enableMicrophone(isEnableMicrophone);
}

function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, message);
}

function disable(domId) {
  document.getElementById(domId).disabled = 'disabled';
}

function enable(domId) {
  document.getElementById(domId).disabled = '';
}

function remove(domID) {
  var elem = document.getElementById(domID);
  elem.parentNode.removeChild(elem);
}

easyrtc.setStreamAcceptor(function (easyrtcid, stream) {
  // var audio = document.getElementById('callerAudio');
  var videos = document.getElementById('videos');
  var video = document.createElement('video');
  video.setAttribute('id', 'audio' + easyrtcid);
  video.setAttribute('autoplay', 'autoplay');
  video.setAttribute('playsinline', 'playsinline');
  videos.appendChild(video);
  easyrtc.setVideoObjectSrc(video, stream);
  // enable("hangupButton");
});

easyrtc.setOnStreamClosed(function (easyrtcid) {
  var video = document.getElementById('audio' + easyrtcid);
  easyrtc.setVideoObjectSrc(video, '');
  remove('audio' + easyrtcid);
  // disable("hangupButton");
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'g') {
    isEnableMicrophone = true;
    easyrtc.enableMicrophone(isEnableMicrophone);
  } else if (e.key === 'm') {
    isEnableMicrophone = false;
    easyrtc.enableMicrophone(isEnableMicrophone);
  } else if (e.key === 'v' && e.ctrlKey) {
    if (isJoinRoom) {
      leaveRoom(currentRoomName);
    } else {
      joinRoom(currentRoomName);
    }
  }
});

// document.addEventListener('keypress', (e) => {
//   if (e.key === 'g') {
//     isEnableMicrophone = true;
//     easyrtc.enableMicrophone(isEnableMicrophone);
//   }
// });

function IsSpeaking() {
  return isEnableMicrophone;
}
