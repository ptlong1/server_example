const express = require("express");

const router = express.Router();

router.get('/demo_audio_rooms.html', function(req, res){
	res.render('audio/demo_audio_rooms.html');
});

module.exports = router;