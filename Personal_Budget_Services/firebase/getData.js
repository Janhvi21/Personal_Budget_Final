const firebase = require('./firebase_connect');

module.exports = {
    getUserInfo: function (req, callback) {
        var userId = req;
        return firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
            callback(null, snapshot.val())
        });
    }
}