const firebase = require('./firebase_connect');

module.exports = {
    createNewUser: function (req) {
        let month = [];
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        let uid = req.uid;
        let date = new Date();
        let currMonth = month[date.getMonth()];
        firebase.database().ref("users/" + uid).set({
            username: req.displayName,
            email: req.email,
            [date.getFullYear()]: {
                [currMonth]: {
                    Budget: {
                        Rent: 400,
                        Grocery: 200,
                        Entertainment: 50,
                        Shopping: 150,
                        EatOut: 50,
                        Miscellaneous: 50,
                        Academic: 40
                    },
                    Expense: {
                        Rent: 0,
                        Grocery: 0,
                        Entertainment: 0,
                        Shopping: 0,
                        EatOut: 0,
                        Miscellaneous: 0,
                        Academic: 0
                    },
                    TotalBudget: 940,
                    TotalExpense: 0
                }
            }
        });
    },
    insertCategory: function (req, callback) {
        var userId = req.body.uid.uid;
        var budget = firebase.database().ref("users/" + userId + "/" + req.query.year + "/" + req.query.month + "/Budget");
        budget.update({
            [req.query.category]: Number(req.query.Amount)
        });
        var expense = firebase.database().ref("users/" + userId + "/" + req.query.year + "/" + req.query.month + "/Expense");
        expense.update({
            [req.query.category]: 0
        });
        callback(null, {
            "statusCode": 200,
            "message": "Category Inserted Successfully!"
        })
    },
    deleteCategory: function (req, callback) {
        var userId = req.body.uid.uid;
        var budget = firebase.database().ref("users/" + userId + "/" + req.query.year + "/" + req.query.month + "/Budget/" + req.query.key);
        budget.remove();
        var expense = firebase.database().ref("users/" + userId + "/" + req.query.year + "/" + req.query.month + "/Expense/" + req.query.key);
        expense.remove();
        callback(null, {
            "statusCode": 200,
            "message": "Category deleted Successfully!"
        })
    },
    deleteTransactions: function (req, callback) {
        var userId = req.body.uid.uid;
        var expense = firebase.database().ref("users/" + userId + "/" + req.query.year + "/" + req.query.month + "/Transactions/" + req.query.id);
        expense.remove();
        firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/TotalExpense").once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();

            exp = exp - Number(req.query.spent);
            firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/TotalExpense").set(exp);

        });
        firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/Expense/" + req.query.category).once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp - Number(req.query.spent);
            firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/Expense/" + req.query.category).set(exp);

        });
        callback(null, {
            "statusCode": 200,
            "message": "Category deleted Successfully!"
        })
    },
    insertTransaction: function (req, callback) {
        var userId = req.body.uid.uid;
        let count = 0;
        firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/Transactions/").once('value').then((snapshot) => {

            for (let row in snapshot.val()) {
                count++;
            }
            firebase.database().ref("users/" + userId + "/" + req.query.year + "/" + req.query.month + "/Transactions/" + count).set({
                Category: req.query.Category,
                Date: req.query.Date,
                Details: req.query.Details,
                Spent: Number(req.query.Spent)
            });
        });
        firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/TotalExpense").once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp + Number(req.query.Spent);
            firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/TotalExpense").set(exp);

        });
        firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/Expense/" + req.query.Category).once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp + Number(req.query.Spent);
            firebase.database().ref('/users/' + userId + "/" + req.query.year + "/" + req.query.month + "/Expense/" + req.query.Category).set(exp);

        });
        callback(null, {
            "statusCode": 200,
            "message": "Transaction Inserted Successfully!"
        })
    },
    addMonthtoDB: function (req, callback) {
        var userId = req.body.uid.uid;
        let budget = {};
        let totalBudget = 0;
        let expense = {};
        firebase.database().ref('/users/' + userId + '/' + req.query.currYear + '/' + req.query.currMonth).once('value').then((snapshot) => {
            budget = snapshot.val().Budget;
            totalBudget = snapshot.val().TotalBudget;
            expense = snapshot.val().Expense;
            for (let con in expense) {
                expense.con = 0;
            }
            firebase.database().ref("users/" + userId + '/' + req.query.year + '/' + req.query.month).update({
                Budget: budget,
                Expense: expense,
                TotalBudget: totalBudget,
                TotalExpense: 0
            });
        });

        callback(null, {
            "statusCode": 200,
            "message": "Transaction Inserted Successfully!"
        })
    }
}