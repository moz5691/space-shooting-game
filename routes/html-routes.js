const path = require('path');

module.exports = function(app) {
    //Sends homepage to client
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
};  
