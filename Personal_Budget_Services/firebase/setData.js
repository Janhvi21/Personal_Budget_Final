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
        var userId = req.user.uid;
        var budget = firebase.database().ref("users/" + userId + "/" + req.body.params.year + "/" +req.body.params.month + "/Budget");
        budget.update({
            [req.body.params.category]: Number(req.body.params.Amount)
        });
        var expense = firebase.database().ref("users/" + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Expense");
        expense.update({
            [req.body.params.category]: 0
        });
        callback(null, {
            "statusCode": 200,
            "message": "Category Inserted Successfully!"
        })
    },
    deleteCategory: function (req, callback) {
        var userId = req.user.uid;
        var budget = firebase.database().ref("users/" + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Budget/" + req.body.params.key);
        budget.remove();
        var expense = firebase.database().ref("users/" + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Expense/" + req.body.params.key);
        expense.remove();
        callback(null, {
            "statusCode": 200,
            "message": "Category deleted Successfully!"
        })
    },
    deleteTransactions: function (req, callback) {
        var userId = req.user.uid;
        var expense = firebase.database().ref("users/" + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Transactions/" + req.body.params.id);
        expense.remove();
        firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/TotalExpense").once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();

            exp = exp - Number(req.body.params.spent);
            firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/TotalExpense").set(exp);

        });
        firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Expense/" + req.body.params.category).once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp - Number(req.body.params.spent);
            firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Expense/" + req.body.params.category).set(exp);

        });
        callback(null, {
            "statusCode": 200,
            "message": "Category deleted Successfully!"
        })
    },
    insertTransaction: function (req, callback) {
        var userId =req.user.uid;
        let count = 0;
        firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Transactions/").once('value').then((snapshot) => {

            for (let row in snapshot.val()) {
                count++;
            }
            firebase.database().ref("users/" + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Transactions/" + count).set({
                Category: req.body.params.Category,
                Date: req.body.params.Date,
                Details: req.body.params.Details,
                Spent: Number(req.body.params.Spent)
            });
        });
        firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/TotalExpense").once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp + Number(req.body.params.Spent);
            firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/TotalExpense").set(exp);

        });
        firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Expense/" + req.body.params.Category).once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp + Number(req.body.params.Spent);
            firebase.database().ref('/users/' + userId + "/" + req.body.params.year + "/" + req.body.params.month + "/Expense/" + req.body.params.Category).set(exp);

        });
        callback(null, {
            "statusCode": 200,
            "message": "Transaction Inserted Successfully!"
        })
    },
    addMonthtoDB: function (req, callback) {
        var userId = req.user.uid;
        let budget = {};
        let totalBudget = 0;
        let expense = {};
        firebase.database().ref('/users/' + userId + '/' + req.body.params.currYear + '/' + req.body.params.currMonth).once('value').then((snapshot) => {
            budget = snapshot.val().Budget;
            totalBudget = snapshot.val().TotalBudget;
            expense = snapshot.val().Expense;
            for (let con in expense) {
                expense.con = 0;
            }
            firebase.database().ref("users/" + userId + '/' + req.body.params.year + '/' + req.body.params.month).update({
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