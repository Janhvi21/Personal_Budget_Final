const firebase = require('./firebase_connect');

module.exports = {
    getallUsers: function (req, callback) {
        var userId = req;
        return firebase.database().ref('/users/').once('value').then((snapshot) => {
            callback(null, snapshot.val())
        });
    },
    getUserInfo: function (req, callback) {
        var userId = req;
        return firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
            callback(null, snapshot.val())
        });
    }
}