const path = require('path');
module.exports = function (app) {
    // app.get('/', function (req, res) {
    //     // res.send('<b>Hello</b> World!');
    //     res.redirect('/mainpage')
    // });
    // // app.get('/404', function (req, res) {
    // //     res.sendFile('404.html', {root: path.join(__dirname, '../')})
    // // });
    app.use('/audio', require('../controllers/audio.route'));
}